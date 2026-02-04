import React, { useState, useEffect, useRef } from 'react';
import styles from './MockTest1.module.css';
import { questions } from './MockTest1Data';

const MockTest1 = () => {
    // Stages: 'landing', 'instructions', 'test', 'result'
    const [stage, setStage] = useState('landing');

    // Candidate Info
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        dateOfBirth: ''
    });

    // Test State
    const [currentSubject, setCurrentSubject] = useState('physics');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: optionIndex }
    const [questionStatus, setQuestionStatus] = useState({}); // { questionId: 'visited' | 'answered' | 'marked' }
    const [timeRemaining, setTimeRemaining] = useState(180 * 60); // 3 hours in seconds
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showPalette, setShowPalette] = useState(false); // Mobile palette state

    // Refs
    const timerRef = useRef(null);


    // Initial Load - Check for saved state
    useEffect(() => {
        const savedStage = localStorage.getItem('neet_mock_stage');
        const savedTime = localStorage.getItem('neet_mock_time');
        const savedAnswers = JSON.parse(localStorage.getItem('neet_mock_answers') || '{}');
        const savedStatus = JSON.parse(localStorage.getItem('neet_mock_status') || '{}');

        if (savedStage === 'test' && savedTime) {
            setStage('test');
            setTimeRemaining(parseInt(savedTime));
            setAnswers(savedAnswers);
            setQuestionStatus(savedStatus);
        }
    }, []);

    // Timer Effect
    useEffect(() => {
        if (stage === 'test' && !isSubmitted) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        submitTest();
                        return 0;
                    }
                    localStorage.setItem('neet_mock_time', prev - 1);
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [stage, isSubmitted]);

    // Save Progress
    useEffect(() => {
        if (stage === 'test') {
            localStorage.setItem('neet_mock_answers', JSON.stringify(answers));
            localStorage.setItem('neet_mock_status', JSON.stringify(questionStatus));
            localStorage.setItem('neet_mock_stage', stage);
        }
    }, [answers, questionStatus, stage]);

    // Helper: Get current question list
    const getCurrentQuestions = () => questions[currentSubject] || [];
    const currentQuestion = getCurrentQuestions()[currentQuestionIndex];
    const totalQuestions = questions.physics.length + questions.chemistry.length + questions.biology.length;

    // --- Actions ---

    const handleStartTest = () => {
        setStage('test');
        // Initialize status for all questions as 'not-visited' implicitly
        // Mark first question as visited
        const firstQId = questions.physics[0].id;
        setQuestionStatus(prev => ({ ...prev, [firstQId]: prev[firstQId] || 'visited' }));
    };

    const handleAnswer = (optionIndex) => {
        if (!currentQuestion) return;
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionIndex }));
        setQuestionStatus(prev => ({ ...prev, [currentQuestion.id]: 'answered' }));
    };

    const handleMarkForReview = () => {
        if (!currentQuestion) return;
        setQuestionStatus(prev => ({ ...prev, [currentQuestion.id]: 'marked' }));
    };

    const handleNext = () => {
        const subjectQuestions = getCurrentQuestions();
        if (currentQuestionIndex < subjectQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Try to move to next subject
            const subjects = ['physics', 'chemistry', 'biology'];
            const currIdx = subjects.indexOf(currentSubject);
            if (currIdx < subjects.length - 1) {
                setCurrentSubject(subjects[currIdx + 1]);
                setCurrentQuestionIndex(0);
            }
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        } else {
            // Try to move to prev subject
            const subjects = ['physics', 'chemistry', 'biology'];
            const currIdx = subjects.indexOf(currentSubject);
            if (currIdx > 0) {
                const prevSubject = subjects[currIdx - 1];
                setCurrentSubject(prevSubject);
                setCurrentQuestionIndex(questions[prevSubject].length - 1);
            }
        }
    };

    const handleJumpToQuestion = (subject, index) => {
        setCurrentSubject(subject);
        setCurrentQuestionIndex(index);
        // Mark as visited if not already answered/marked
        const qId = questions[subject][index].id;
        setQuestionStatus(prev => {
            if (prev[qId] === 'answered' || prev[qId] === 'marked') return prev;
            return { ...prev, [qId]: 'visited' };
        });
    };

    const submitTest = () => {
        setIsSubmitted(true);
        setStage('result');
        clearInterval(timerRef.current);
        localStorage.removeItem('neet_mock_stage');
        localStorage.removeItem('neet_mock_time');
        localStorage.removeItem('neet_mock_answers');
        localStorage.removeItem('neet_mock_status');
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const calculateScore = () => {
        let score = 0;
        let correct = 0;
        let wrong = 0;
        let unattempted = 0;

        ['physics', 'chemistry', 'biology'].forEach(subj => {
            questions[subj].forEach(q => {
                const userAns = answers[q.id];
                if (userAns !== undefined) {
                    if (userAns === q.correct) {
                        score += 4;
                        correct++;
                    } else {
                        score -= 1;
                        wrong++;
                    }
                } else {
                    unattempted++;
                }
            });
        });
        return { score, correct, wrong, unattempted };
    };

    // --- Renders ---

    const renderLanding = () => (
        <div className={styles.innerContainer}>
            <div className={styles.header}>
                <h1>🩺 NEET 2026 Mock Test</h1>
                <p className={styles.subtitle}>🎯 National Eligibility cum Entrance Test - Practice Examination</p>
            </div>
            <div className={styles.homeMain}>
                <div className={styles.card}>
                    <h2>👤 Enter Candidate Details</h2>
                    <form onSubmit={(e) => { e.preventDefault(); setStage('instructions'); }}>
                        <div className={styles.formGroup}>
                            <label>Full Name:</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Roll Number:</label>
                            <input
                                required
                                type="text"
                                value={formData.rollNumber}
                                onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
                                placeholder="Enter your roll number"
                            />
                        </div>
                        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Proceed to Instructions</button>
                    </form>
                </div>
                <div className={styles.card}>
                    <h3>📚 Examination Details</h3>
                    <ul style={{ lineHeight: '2', paddingLeft: '20px' }}>
                        <li><strong>Total Questions:</strong> {totalQuestions}</li>
                        <li><strong>Duration:</strong> 3 hours (180 minutes)</li>
                        <li><strong>Marks:</strong> +4 Correct, -1 Incorrect</li>
                        <li><strong>Subjects:</strong> Physics, Chemistry, Biology</li>
                    </ul>
                </div>
            </div>
        </div>
    );

    const renderInstructions = () => (
        <div className={styles.innerContainer}>
            <div className={styles.instructionBox}>
                <h3>📋 Instructions</h3>
                <div className={styles.candidateInfoDisplay}>
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Roll Number:</strong> {formData.rollNumber}</p>
                </div>
                <div style={{ margin: '20px 0' }}>
                    <p>Please read the following instructions carefully:</p>
                    <ul style={{ margin: '15px 0 15px 30px', lineHeight: '1.6' }}>
                        <li>The test contains 3 sections: Physics, Chemistry, and Biology.</li>
                        <li>Each question carries 4 marks. 1 mark will be deducted for every wrong answer.</li>
                        <li>The clock will cover the entire duration of the examination.</li>
                    </ul>
                    <div className={styles.warningBox}>
                        ⚠️ Do not close or refresh the window once the test starts.
                    </div>
                </div>
                <button onClick={handleStartTest} className={`${styles.btn} ${styles.btnPrimary}`}>Start Test</button>
            </div>
        </div>
    );

    const renderTest = () => {
        if (!currentQuestion) return <div>Loading...</div>;

        const qId = currentQuestion.id;
        const status = questionStatus[qId];
        const selectedOption = answers[qId];

        return (
            <div className={styles.testContainer}>
                <header className={styles.testHeader}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h2>NEET 2026 Mock</h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className={styles.timer + ' ' + (timeRemaining < 600 ? styles.timerWarning : '')}>
                            {formatTime(timeRemaining)}
                        </div>
                        <button
                            className={styles.mobilePaletteToggle}
                            onClick={() => setShowPalette(!showPalette)}
                        >
                            ☰
                        </button>
                    </div>
                </header>

                <div className={styles.testMain}>
                    <div className={styles.questionPanel}>
                        <div className={styles.questionHeader}>
                            <div className={styles.subjectSelector}>
                                {['physics', 'chemistry', 'biology'].map(subj => (
                                    <button
                                        key={subj}
                                        className={`${styles.subjectBtn} ${currentSubject === subj ? styles.subjectBtnActive : ''}`}
                                        onClick={() => { setCurrentSubject(subj); setCurrentQuestionIndex(0); }}
                                    >
                                        {subj.charAt(0).toUpperCase() + subj.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <div className={styles.sectionIndicator}>
                                Q.{currentQuestionIndex + 1}
                            </div>
                        </div>

                        <div className={styles.questionContent}>
                            <div className={styles.questionText} style={{ whiteSpace: 'pre-wrap' }}>
                                {currentQuestion.question}
                            </div>
                            <div className={styles.optionsContainer}>
                                {currentQuestion.options.map((opt, idx) => (
                                    <div
                                        key={idx}
                                        className={`${styles.optionItem} ${selectedOption === idx ? styles.optionSelected : ''}`}
                                        onClick={() => handleAnswer(idx)}
                                    >
                                        <div style={{
                                            width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #ccc',
                                            flexShrink: 0,
                                            background: selectedOption === idx ? 'var(--primary-color)' : 'transparent'
                                        }}></div>
                                        <span>{opt}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.questionActions}>
                            <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleMarkForReview}>Mark</button>
                            <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => {
                                const newAns = { ...answers };
                                delete newAns[qId];
                                setAnswers(newAns);
                                setQuestionStatus(prev => ({ ...prev, [qId]: 'visited' }));
                            }}>Clear</button>
                            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handlePrev}>Prev</button>
                            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleNext}>Next</button>
                        </div>
                    </div>

                    {/* Palette Overlay for Mobile */}
                    <div
                        className={`${styles.paletteOverlay} ${showPalette ? styles.open : ''}`}
                        onClick={() => setShowPalette(false)}
                    ></div>

                    <div className={`${styles.palettePanel} ${showPalette ? styles.open : ''}`}>
                        <div className={styles.paletteHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>Question Palette</h3>
                            <button
                                className={styles.mobilePaletteToggle}
                                style={{ display: 'flex', marginLeft: 0 }}
                                onClick={() => setShowPalette(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className={styles.paletteHeader}>
                            <div className={styles.legend}>
                                <div className={styles.legendItem}><div className={`${styles.legendColor} ${styles.bgAnswered}`}></div> Ans</div>
                                <div className={styles.legendItem}><div className={`${styles.legendColor} ${styles.bgNotAnswered}`}></div> No Ans</div>
                                <div className={styles.legendItem}><div className={`${styles.legendColor} ${styles.bgMarked}`}></div> Mark</div>
                                <div className={styles.legendItem}><div className={`${styles.legendColor} ${styles.bgNotVisited}`}></div> Not Vis</div>
                            </div>
                        </div>
                        <div className={styles.paletteContent}>
                            {['physics', 'chemistry', 'biology'].map(subj => (
                                <div key={subj} style={{ display: currentSubject === subj ? 'block' : 'none' }}>
                                    <h4 style={{ marginBottom: '10px', textTransform: 'capitalize' }}>{subj}</h4>
                                    <div className={styles.questionGrid}>
                                        {questions[subj].map((q, idx) => {
                                            const s = questionStatus[q.id];
                                            let statusClass = '';
                                            if (s === 'answered') statusClass = styles.qStatusAnswered;
                                            else if (s === 'marked') statusClass = styles.qStatusMarked;
                                            else if (s === 'visited') statusClass = styles.qStatusNotAnswered; // Visited but no answer

                                            // Highlight current
                                            if (currentSubject === subj && currentQuestionIndex === idx) statusClass += ' ' + styles.qStatusCurrent;

                                            return (
                                                <div
                                                    key={q.id}
                                                    className={`${styles.questionNumBtn} ${statusClass}`}
                                                    onClick={() => {
                                                        handleJumpToQuestion(subj, idx);
                                                        if (window.innerWidth <= 900) setShowPalette(false);
                                                    }}
                                                >
                                                    {idx + 1}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.paletteFooter}>
                            <button className={`${styles.btn} ${styles.btnDanger}`} style={{ width: '100%' }} onClick={() => setShowSubmitModal(true)}>Submit Test</button>
                        </div>
                    </div>
                </div>

                {/* Submit Modal */}
                {showSubmitModal && (
                    <div style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div className={styles.card} style={{ maxWidth: '400px', width: '90%' }}>
                            <h3>Confirm Submission</h3>
                            <p>Are you sure you want to submit?</p>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setShowSubmitModal(false)}>Cancel</button>
                                <button className={`${styles.btn} ${styles.btnDanger}`} onClick={submitTest}>Yes, Submit</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderResult = () => {
        const { score, correct, wrong, unattempted } = calculateScore();
        return (
            <div className={styles.innerContainer}>
                <div className={styles.resultContainer}>
                    <h1>🎉 Test Submitted Successfully!</h1>
                    <div className={styles.scoreCard}>
                        <div className={styles.scoreItem}>
                            <h3>{score}</h3>
                            <p>Total Score</p>
                        </div>
                        <div className={styles.scoreItem}>
                            <h3 style={{ color: 'var(--success-color)' }}>{correct}</h3>
                            <p>Correct</p>
                        </div>
                        <div className={styles.scoreItem}>
                            <h3 style={{ color: 'var(--danger-color)' }}>{wrong}</h3>
                            <p>Wrong</p>
                        </div>
                    </div>

                    <div className={styles.subjectAnalysis}>
                        <h3>Subject-wise Analysis</h3>
                        {['physics', 'chemistry', 'biology'].map(subj => {
                            let sCorrect = 0;
                            questions[subj].forEach(q => {
                                if (answers[q.id] === q.correct) sCorrect++;
                            });
                            return (
                                <div key={subj} className={styles.subjectRow}>
                                    <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{subj}</span>
                                    <span>{sCorrect} / {questions[subj].length} Correct</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className={styles.resultDetailed}>
                        <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>📝 Detailed Analysis</h2>
                        {['physics', 'chemistry', 'biology'].map(subj => (
                            <div key={subj} className={styles.resultSubjectSection}>
                                <h3 className={styles.resultSubjectTitle}>{subj}</h3>
                                {questions[subj].map((q, qIdx) => {
                                    const userAns = answers[q.id];
                                    const isCorrect = userAns === q.correct;
                                    const isSkipped = userAns === undefined;

                                    return (
                                        <div key={q.id} className={styles.resultQuestionBlock}>
                                            <div className={styles.resultQuestionText}>
                                                <strong>Q{qIdx + 1}.</strong> <span style={{ whiteSpace: 'pre-wrap' }}>{q.question}</span>
                                            </div>
                                            <div className={styles.resultOptionsList}>
                                                {q.options.map((opt, optIdx) => {
                                                    const isOptionCorrect = optIdx === q.correct;
                                                    const isOptionSelected = userAns === optIdx;

                                                    let optionClass = styles.resultOptionItem;
                                                    if (isOptionCorrect) optionClass += ` ${styles.resultOptionCorrect}`;
                                                    else if (isOptionSelected && !isCorrect) optionClass += ` ${styles.resultOptionWrong}`;

                                                    return (
                                                        <div key={optIdx} className={optionClass}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                                                <div style={{
                                                                    width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #ccc',
                                                                    background: isOptionSelected ? (isCorrect ? 'var(--success-color)' : 'var(--danger-color)') : (isOptionCorrect ? 'var(--success-color)' : 'transparent'),
                                                                    borderColor: isOptionSelected || isOptionCorrect ? 'transparent' : '#ccc',
                                                                    flexShrink: 0
                                                                }}></div>
                                                                <span>{opt}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                                                {isOptionSelected && <span className={`${styles.resultBadge} ${styles.badgeYourAnswer}`}>Your Answer</span>}
                                                                {isOptionCorrect && <span className={`${styles.resultBadge} ${styles.badgeCorrect}`}>Correct Answer</span>}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div style={{ marginTop: '10px', fontSize: '0.9rem', fontWeight: 'bold', color: isCorrect ? 'var(--success-color)' : (isSkipped ? 'var(--text-muted)' : 'var(--danger-color)') }}>
                                                {isCorrect ? '✅ Correct' : (isSkipped ? '⚪ Unattempted' : '❌ Incorrect')}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <button
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        style={{ marginTop: '30px', width: '100%', maxWidth: '300px' }}
                        onClick={() => {
                            setStage('landing');
                            setIsSubmitted(false);
                            setAnswers({});
                            setQuestionStatus({});
                            setTimeRemaining(180 * 60);
                        }}
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            {stage === 'landing' && renderLanding()}
            {stage === 'instructions' && renderInstructions()}
            {stage === 'test' && renderTest()}
            {stage === 'result' && renderResult()}
        </div>
    );
};

export default MockTest1;
