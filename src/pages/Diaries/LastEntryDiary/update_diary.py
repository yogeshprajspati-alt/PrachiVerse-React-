import json
import os

transcript_path = r"C:\Users\yoges\.gemini\antigravity-cli\brain\10720e7c-b50d-4f0f-aa8f-15d6cd9d3fa6\.system_generated\logs\transcript_full.jsonl"
if not os.path.exists(transcript_path):
    transcript_path = r"C:\Users\yoges\.gemini\antigravity-cli\brain\10720e7c-b50d-4f0f-aa8f-15d6cd9d3fa6\.system_generated\logs\transcript.jsonl"

content = ""
with open(transcript_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for line in reversed(lines):
        data = json.loads(line)
        if data.get('type') == 'USER_INPUT':
            text = data.get('content', '')
            if "ab mera content add karna" in text:
                content = text
                break

# Extract the actual content
start_idx = content.find("It was not you.")
end_idx = content.find("</USER_REQUEST>")

if start_idx != -1 and end_idx != -1:
    content = content[start_idx:end_idx].strip()
elif start_idx != -1:
    content = content[start_idx:].strip()

# Split into paragraphs
paragraphs = [p.strip() for p in content.split('\n\n') if p.strip()]

# Clean any weird meta tags just in case
paragraphs = [p for p in paragraphs if not p.startswith('<ADDITIONAL_METADATA>') and not p.startswith('The current local')]

# Distribute paragraphs into 7 cards
cards_content = [[] for _ in range(7)]
if len(paragraphs) > 0:
    chunk_size = len(paragraphs) // 7
    extra = len(paragraphs) % 7
    curr_idx = 0
    for i in range(7):
        size = chunk_size + (1 if i < extra else 0)
        cards_content[i] = paragraphs[curr_idx:curr_idx+size]
        curr_idx += size

# Generate JSX
jsx_template = """import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LastEntryDiary.module.css';

const LastEntryDiary = () => {
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const [particles] = useState(() =>
        Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            size: Math.random() * 4 + 2,
            left: Math.random() * 100,
            duration: Math.random() * 15 + 10,
            delay: Math.random() * 5
        }))
    );

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(() => console.log("Audio play failed"));
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(styles.visible);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

        const cards = document.querySelectorAll(`.${styles.textCard}, .${styles.endMarker}`);
        cards.forEach(card => observer.observe(card));

        return () => observer.disconnect();
    }, []);

    return (
        <div className={styles.mobileDiaryContainer}>
            <audio ref={audioRef} loop src="/assets/diaries/lavender-mist/background.mp3" />

            <div className={styles.particlesOverlay}>
                {particles.map(p => (
                    <div
                        key={p.id}
                        className={styles.particle}
                        style={{
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            left: `${p.left}%`,
                            animationDuration: `${p.duration}s`,
                            animationDelay: `${p.delay}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className={styles.topControls}>
                <div className={styles.iconBtn} onClick={() => navigate('/')}>
                    <i className="fas fa-arrow-left"></i>
                </div>
                <div className={styles.iconBtn} onClick={toggleAudio}>
                    <i className={`fas ${isPlaying ? 'fa-volume-up' : 'fa-volume-mute'}`}></i>
                </div>
            </div>

            <div className={styles.parallaxBg}></div>

            <section className={styles.coverSection}>
                <div className={styles.coverOverlay}></div>
                <div className={styles.coverText}>
                    <h1 className={styles.grandTitle}>The Last Entry</h1>
                    <p className={styles.subTitle}>For You, Prachi</p>
                </div>
                <div className={styles.scrollPrompt}>
                    <span>Swipe up to read</span>
                    <i className="fas fa-chevron-down"></i>
                </div>
            </section>

            <section className={styles.storySection}>
                <div className={styles.contentWrapper}>
"""

card_titles = [
    "The Realization",
    "Understanding & Boundaries",
    "Moving Forward",
    "Why I did it",
    "Misunderstandings",
    "You are a Princess",
    "Farewell"
]

for i, card_paragraphs in enumerate(cards_content):
    if not card_paragraphs:
        continue
    jsx_template += f'                    <div className={{styles.textCard}}>\n'
    if i == 0:
        jsx_template += f'                        <div className={{styles.dateMarker}}>{card_titles[i]}</div>\n'
        first_p = card_paragraphs[0]
        first_word = first_p.split(' ')[0]
        rest = first_p[len(first_word):]
        jsx_template += f'                        <p className={{styles.dropCap}}>{first_word}</p>\n'
        jsx_template += f'                        <p style={{{{ display: \'inline\' }}}}>{rest}</p>\n'
        for p in card_paragraphs[1:]:
            jsx_template += f'                        <p>{p}</p>\n'
    else:
        if card_titles[i]:
            jsx_template += f'                        <div className={{styles.dateMarker}}>{card_titles[i]}</div>\n'
        for j, p in enumerate(card_paragraphs):
            if j == 0 and i % 2 != 0:
                jsx_template += f'''                        <div className={{styles.highlightBlock}}>
                            <i className="fas fa-quote-left"></i>
                            <div className={{styles.highlightText}}>"{p[:60]}..."</div>
                            <i className="fas fa-quote-right"></i>
                        </div>\n'''
            jsx_template += f'                        <p>{p}</p>\n'
    jsx_template += f'                    </div>\n\n'

jsx_template += """                    {/* End Marker */}
                    <div className={styles.endMarker}>
                        <div className={styles.dividerLine}></div>
                        <h2 className={styles.signatureTitle}>Forever,</h2>
                        <h1 className={styles.signatureName}>Deep</h1>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LastEntryDiary;
"""

output_path = r"X:\Deepak\PERSONAL\Prachiverse Varitations\v11\PrachiVerse-React--main\src\pages\Diaries\LastEntryDiary\LastEntryDiary.jsx"
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(jsx_template)

print("Diary fixed and updated successfully.")
