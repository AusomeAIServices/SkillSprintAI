"use client";

import { useEffect, useState } from "react";
import { aiJourneyWaves, flattenedJourneyTopics, journeyTopicCount } from "@/modules/learning/ai-journey";

const progressKey = "skillsprint-ai-understanding-journey-v2";

export function AIUnderstandingJourney({ onStartSearchPractice, searchPracticeActionLabel }: { onStartSearchPractice: () => void; searchPracticeActionLabel: string }) {
  const [completedCount, setCompletedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const stored = Number(window.localStorage.getItem(progressKey));
        if (Number.isInteger(stored) && stored >= 0) setCompletedCount(Math.min(stored, journeyTopicCount));
      } catch { /* Progress is still usable for this visit if storage is unavailable. */ }
      setIsReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const current = flattenedJourneyTopics[completedCount];
  const currentMilestone = current?.milestone;
  const currentLevelIndex = current?.milestone.topics.findIndex((topic) => topic.id === current.id) ?? -1;
  const milestoneCompleted = Math.floor(completedCount / 3);
  const progressPercent = Math.round((completedCount / journeyTopicCount) * 100);

  const advance = () => {
    if (!isReady || !current) return;
    const nextCount = Math.min(completedCount + 1, journeyTopicCount);
    setCompletedCount(nextCount);
    setAnnouncement(nextCount % 3 === 0 ? "Milestone badge earned! Keep your progress or continue at your own pace." : "Topic complete. Your next topic is ready.");
    try { window.localStorage.setItem(progressKey, String(nextCount)); } catch { /* Do not block the learner if storage is unavailable. */ }
  };

  return <section className="ai-journey" id="ai-understanding-journey" aria-labelledby="ai-journey-title">
    <div className="journey-heading">
      <div>
        <div className="eyebrow">YOUR PERSONAL AI LEARNING PATH</div>
        <h2 id="ai-journey-title">What is AI?</h2>
        <p>One topic at a time. Start easy, build skill, and advance when you understand.</p>
      </div>
      <div className="journey-rewards" aria-label="Journey rewards">
        <div className="reward-chip xp-chip"><span aria-hidden="true">✦</span><strong>{completedCount * 10} XP</strong><small>earned</small></div>
        <div className="reward-chip badge-chip"><span aria-hidden="true">◆</span><strong>{milestoneCompleted}</strong><small>{milestoneCompleted === 1 ? "badge" : "badges"}</small></div>
      </div>
    </div>

    <div className="journey-progress-wrap">
      <div className="journey-progress-label"><span>{isReady ? completedCount + " of " + journeyTopicCount + " topics" : "Loading your progress…"}</span><span>{progressPercent}%</span></div>
      <div className="journey-progress" role="progressbar" aria-label="What is AI? learning progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={isReady ? progressPercent : 0}><span style={{ width: (isReady ? progressPercent : 0) + "%" }} /></div>
    </div>

    {current && currentMilestone ? <div className="journey-focus" aria-live="polite">
      <div className="journey-focus-top"><span className="journey-stage">WAVE {current.waveIndex + 1} OF {aiJourneyWaves.length}</span><span className="journey-stage">MILESTONE {current.milestoneIndex + 1} OF {current.wave.milestones.length}</span><span className={"difficulty-pill difficulty-" + current.difficulty.toLowerCase()}>{current.difficulty}</span></div>
      <p className="journey-milestone-name">{currentMilestone.title}</p>
      <h3>{current.title}</h3>
      <p className="journey-explanation">{current.explanation}</p>
      <div className="journey-practice"><span className="journey-practice-label">TRY THIS</span><p>{current.practice}</p></div>
      <div className="journey-level-track" aria-label={currentMilestone.title + " topic levels"}>
        {currentMilestone.topics.map((topic, index) => <div key={topic.id} className={"journey-level " + (index < currentLevelIndex ? "is-complete" : index === currentLevelIndex ? "is-current" : "is-upcoming")}>
          <span className={"difficulty-pill difficulty-" + topic.difficulty.toLowerCase()}>{index < currentLevelIndex ? "✓ " : ""}{topic.difficulty}</span>
          <span>{topic.title}</span>
        </div>)}
      </div>
      <div className="journey-actions">
        {current.id === "search-vs-chatgpt" && <button className="secondary-button" type="button" onClick={onStartSearchPractice}>{searchPracticeActionLabel}</button>}
        <button className="primary-button understand-button" type="button" disabled={!isReady} onClick={advance}><span aria-hidden="true">✦</span> AI Understand <span aria-hidden="true">→</span></button>
      </div>
      <p className="journey-feedback" aria-live="polite">{announcement}</p>
    </div> : <div className="journey-complete" role="status">
      <span className="journey-complete-icon" aria-hidden="true">★</span><h3>Journey complete!</h3>
      <p>You explored all three waves. Keep practising with real tasks and trusted sources.</p>
      <p className="journey-complete-reward">🏆 {completedCount * 10} XP · {milestoneCompleted} milestone badges</p>
    </div>}

    <div className="journey-waves">
      {aiJourneyWaves.map((wave, waveIndex) => {
        const waveStart = flattenedJourneyTopics.findIndex((topic) => topic.wave.id === wave.id);
        const waveEnd = waveStart + wave.milestones.reduce((sum, milestone) => sum + milestone.topics.length, 0);
        const completedInWave = Math.max(0, Math.min(completedCount - waveStart, waveEnd - waveStart));
        return <article key={wave.id} className={"journey-wave " + (current?.wave.id === wave.id ? "wave-active" : completedCount >= waveEnd ? "wave-complete" : "")}>
          <div className="wave-heading"><span className="wave-number">0{waveIndex + 1}</span><div><h3>{wave.title}</h3><p>{wave.summary}</p></div><span className="wave-count">{completedInWave}/9</span></div>
          <div className="wave-milestones">{wave.milestones.map((milestone) => {
            const milestoneGlobalStart = flattenedJourneyTopics.findIndex((topic) => topic.milestone.id === milestone.id);
            const levelDone = Math.max(0, Math.min(completedCount - milestoneGlobalStart, milestone.topics.length));
            return <div key={milestone.id} className={"milestone-card " + (levelDone === 3 ? "milestone-complete" : current?.milestone.id === milestone.id ? "milestone-active" : "milestone-upcoming")}>
              <div className="milestone-card-heading"><strong>{milestone.title}</strong>{levelDone === 3 ? <span aria-label="Milestone complete">★ Badge</span> : <span>{levelDone}/3</span>}</div>
              <p>{milestone.summary}</p>
              <div className="milestone-difficulties">{milestone.topics.map((topic) => <span key={topic.id} className={"difficulty-pill difficulty-" + topic.difficulty.toLowerCase()}>{topic.difficulty}</span>)}</div>
              <ul className="milestone-topic-list">{milestone.topics.map((topic, topicIndex) => <li key={topic.id} className={topicIndex < levelDone ? "topic-done" : ""}>{topic.title}</li>)}</ul>
            </div>;
          })}</div>
        </article>;
      })}
    </div>
    <p className="journey-footnote">Progress and rewards stay on this device. No streak pressure. This guide advances through authored topics; it does not call an AI model.</p>
  </section>;
}
