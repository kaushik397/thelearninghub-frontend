import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateDiagnosticQuiz, generateSourceSections, submitDiagnosticQuizResults } from '../api/learningHub';
import { saveGeneratedNotes } from '../api/userData';

const UNSURE_OPTION = '__unsure';
const quizRequestCache = new Map();

const AssessmentQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialSession = location.state?.chatSession;
  const learnerGoal = location.state?.topic?.trim() || 'Help me study this material';
  const learningSession = location.state?.learningSession;
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [confidences, setConfidences] = useState({});
  const [error, setError] = useState('');
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true);
  const [isBuildingNotes, setIsBuildingNotes] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadQuiz() {
      if (!initialSession?.session_id) {
        setIsLoadingQuiz(false);
        return;
      }
      const requestKey = `${initialSession.session_id}:${learnerGoal}`;

      setIsLoadingQuiz(true);
      setError('');
      try {
        if (!quizRequestCache.has(requestKey)) {
          quizRequestCache.set(
            requestKey,
            generateSourceSections({
              sessionId: initialSession.session_id,
              learnerGoal,
            }).then((sectionPayload) =>
              generateDiagnosticQuiz({
                sessionId: initialSession.session_id,
                learnerGoal,
                sections: sectionPayload.sections,
              }),
            ),
          );
        }
        const quiz = await quizRequestCache.get(requestKey);
        if (cancelled) return;
        setQuestions(quiz.questions || []);
        setConfidences(Object.fromEntries((quiz.questions || []).map((question) => [question.id, 50])));
      } catch (err) {
        quizRequestCache.delete(requestKey);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not generate the diagnostic quiz.');
        }
      } finally {
        if (!cancelled) setIsLoadingQuiz(false);
      }
    }

    loadQuiz();
    return () => {
      cancelled = true;
    };
  }, [initialSession?.session_id, learnerGoal]);

  const currentQuestion = questions[currentIndex];
  const answeredCount = questions.filter((question) => answers[question.id]).length;
  const progressPercent = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] : null;
  const confidence = currentQuestion ? confidences[currentQuestion.id] ?? 50 : 50;

  const quizResultPreview = useMemo(() => {
    if (!questions.length) return null;
    const correctCount = questions.filter((question) => answers[question.id] === question.correct_option_id).length;
    const averageConfidence = Math.round(
      questions.reduce((sum, question) => sum + (confidences[question.id] ?? 50), 0) / questions.length,
    );
    return { correctCount, averageConfidence };
  }, [answers, confidences, questions]);

  const finishQuiz = async () => {
    if (!initialSession?.session_id || isBuildingNotes) return;

    setIsBuildingNotes(true);
    setError('');

    try {
      const payloadAnswers = questions.map((question) => ({
        question_id: question.id,
        selected_option_id: answers[question.id] === UNSURE_OPTION ? null : answers[question.id],
        confidence: confidences[question.id] ?? 50,
      }));
      const focusedNotes = await submitDiagnosticQuizResults({
        sessionId: initialSession.session_id,
        learnerGoal,
        detailLevel: 'standard',
        questions,
        answers: payloadAnswers,
      });
      const generatedNotes = learningSession?.id
        ? await saveGeneratedNotes({
            sessionId: learningSession.id,
            notesMarkdown: focusedNotes.notes_markdown,
            promptVersion: 'quiz-adaptive-v1',
        })
        : location.state?.generatedNotes;

      const nextState = {
        ...location.state,
        chatSession: focusedNotes.chat_session,
        generatedNotes,
        quizResults: {
          questions,
          answers: payloadAnswers,
          summary: quizResultPreview,
        },
        quizCompleted: true,
        notesPartIndex: 0,
      };

      navigate('/assessment', {
        state: nextState,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not build focused notes from your quiz results.');
      setIsBuildingNotes(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1);
      return;
    }
    finishQuiz();
  };

  if (!initialSession) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)', padding: 'var(--space-md)' }}>
        <div className="card" style={{ maxWidth: '520px', padding: 'var(--space-lg)' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', margin: 0, marginBottom: 'var(--space-sm)' }}>
            No quiz ready
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'var(--text-mid)', lineHeight: 1.7 }}>
            Start a session first so FocusPath can prepare your warm-up quiz.
          </p>
          <button type="button" onClick={() => navigate('/start-session')} className="btn-primary">
            Start Session
          </button>
        </div>
      </div>
    );
  }

  if (isLoadingQuiz) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)', padding: 'var(--space-md)' }}>
        <div className="card" style={{ maxWidth: '560px', padding: 'var(--space-lg)', textAlign: 'center' }}>
          <span className="section-label">Preparing Quiz</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', margin: '12px 0' }}>
            Building your diagnostic check
          </h1>
          <p style={{ margin: 0 }}>Gemma is reading the material and writing real questions from the source.</p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)', padding: 'var(--space-md)' }}>
        <div className="card" style={{ maxWidth: '560px', padding: 'var(--space-lg)' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', margin: 0, marginBottom: 'var(--space-sm)' }}>
            Quiz could not be created
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'var(--text-mid)', lineHeight: 1.7 }}>
            {error || 'Gemma did not return enough quiz questions for this source.'}
          </p>
          <button type="button" onClick={() => navigate('/assessment', { state: location.state })} className="btn-primary">
            Continue to Notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <header
        className="fixed top-0 left-0 w-full z-50"
        style={{
          background: 'rgba(253, 248, 216, 0.88)',
          WebkitBackdropFilter: 'blur(24px)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        <div className="flex justify-between items-center h-16 px-6 w-full max-w-[880px] mx-auto">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '22px', margin: 0 }}>
            Focus<span style={{ color: 'var(--primary)' }}>Path</span>
          </h1>
          <span className="section-label">Quiz {currentIndex + 1} of {questions.length}</span>
        </div>
      </header>

      <main
        className="mx-auto max-w-[760px]"
        style={{
          paddingTop: 'var(--space-2xl)',
          paddingBottom: 'var(--space-xl)',
          paddingLeft: 'var(--space-md)',
          paddingRight: 'var(--space-md)',
        }}
      >
        <div className="flex items-center gap-4" style={{ marginBottom: 'var(--space-lg)' }}>
          <span className="section-label" style={{ whiteSpace: 'nowrap' }}>{progressPercent}% ready</span>
          <div className="progress-track flex-grow" style={{ height: '5px' }}>
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        <section
          style={{
            background: 'rgba(255, 255, 255, 0.72)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 28px rgba(12, 26, 29, 0.06)',
            padding: 'clamp(20px, 4vw, 32px)',
          }}
        >
          <span className="section-label" style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>
            {currentQuestion.unit_title}
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 900,
              lineHeight: 1.08,
              margin: 0,
              marginBottom: 'var(--space-sm)',
            }}
          >
            Quick potential check
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 'var(--space-md)' }}>
            {currentQuestion.question}
          </p>

          <div className="flex flex-col" style={{ gap: '12px' }}>
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswer === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setAnswers((current) => ({ ...current, [currentQuestion.id]: option.id }))}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    width: '100%',
                    textAlign: 'left',
                    background: isSelected ? 'var(--primary-pale)' : 'var(--white)',
                    border: `1.5px solid ${isSelected ? 'var(--border-active)' : 'var(--border-light)'}`,
                    borderRadius: '12px',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '14px',
                    lineHeight: 1.55,
                    padding: '14px 16px',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: `1.5px solid ${isSelected ? 'var(--primary)' : 'rgba(12, 26, 29, 0.22)'}`,
                      boxShadow: isSelected ? 'inset 0 0 0 4px var(--white)' : 'none',
                      background: isSelected ? 'var(--primary)' : 'transparent',
                      flex: '0 0 auto',
                      marginTop: '2px',
                    }}
                  />
                  {option.text}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setAnswers((current) => ({ ...current, [currentQuestion.id]: UNSURE_OPTION }))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: selectedAnswer === UNSURE_OPTION ? 'rgba(255, 96, 10, 0.10)' : 'transparent',
                border: '1.5px dashed rgba(255, 96, 10, 0.36)',
                borderRadius: '12px',
                color: 'var(--text-mid)',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
                padding: '14px 16px',
                textAlign: 'left',
              }}
            >
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '19px' }}>help</span>
              I'm not sure, can you explain this part?
            </button>
          </div>

          <div style={{ marginTop: 'var(--space-md)' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '10px' }}>
              <label className="section-label" htmlFor="confidence-slider">Confidence</label>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--text-mid)', fontWeight: 700 }}>
                {confidence}%
              </span>
            </div>
            <input
              id="confidence-slider"
              type="range"
              min="0"
              max="100"
              step="5"
              value={confidence}
              onChange={(event) =>
                setConfidences((current) => ({ ...current, [currentQuestion.id]: Number(event.target.value) }))
              }
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
          </div>
        </section>

        {error && (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#BA1A1A', marginTop: 'var(--space-sm)' }}>
            {error}
          </p>
        )}

        <div className="flex justify-between items-center gap-3" style={{ marginTop: 'var(--space-md)' }}>
          <button
            type="button"
            onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            disabled={currentIndex === 0 || isBuildingNotes}
            className="btn-secondary"
            style={{ opacity: currentIndex === 0 || isBuildingNotes ? 0.45 : 1 }}
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!selectedAnswer || isBuildingNotes}
            className="btn-primary"
            style={{ opacity: selectedAnswer && !isBuildingNotes ? 1 : 0.55 }}
          >
            {isBuildingNotes ? 'Building Notes...' : currentIndex === questions.length - 1 ? 'Build My Notes' : 'Next Question'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default AssessmentQuiz;
