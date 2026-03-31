import { AnimatePresence, motion } from "framer-motion";
import { MdExpandLess, MdExpandMore, MdDeleteOutline } from "react-icons/md";
import "./SubjectCard.css";

export default function SubjectCard({
  subject,
  topics,
  isExpanded,
  onToggle,
  onDeleteSubject,
  onDeleteTopic,
}) {
  const topicCount = topics.length;

  return (
    <motion.article className="subject-card">
      <div
        className="subject-card__accent"
        style={{ background: subject.color }}
        aria-hidden
      />
      <button
        type="button"
        className="subject-card__header"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`subject-panel-${subject.id}`}
        id={`subject-trigger-${subject.id}`}
      >
        <div className="subject-card__heading">
          <h3 className="subject-card__title">{subject.name}</h3>
          <p className="subject-card__description">{subject.description}</p>
          <p className="subject-card__meta">
            {topicCount} topic{topicCount === 1 ? "" : "s"}
          </p>
        </div>
        <span className="subject-card__chevron" aria-hidden>
          {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key={`panel-${subject.id}`}
            id={`subject-panel-${subject.id}`}
            role="region"
            aria-labelledby={`subject-trigger-${subject.id}`}
            className="subject-card__panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="subject-card__panel-inner">
              {topics.length === 0 ? (
                <p className="subject-card__empty">No topics yet.</p>
              ) : (
                <ul className="subject-card__topic-list">
                  {topics.map((topic) => (
                    <li key={topic.id} className="subject-card__topic">
                      <div className="subject-card__topic-main">
                        <span className="subject-card__topic-name">
                          {topic.name}
                        </span>
                        <span className="subject-card__topic-tags">
                          <span className="subject-card__tag">
                            {topic.difficulty}
                          </span>
                          <span className="subject-card__tag subject-card__tag--muted">
                            {topic.status}
                          </span>
                        </span>
                        {topic.notes ? (
                          <p className="subject-card__topic-notes">{topic.notes}</p>
                        ) : null}
                      </div>
                      {onDeleteTopic && (
                        <button
                          type="button"
                          className="subject-card__topic-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteTopic(topic.id);
                          }}
                          aria-label={`Delete topic ${topic.name}`}
                        >
                          <MdDeleteOutline aria-hidden />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {onDeleteSubject && (
                <div className="subject-card__footer">
                  <button
                    type="button"
                    className="subject-card__delete-subject"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSubject(subject.id);
                    }}
                  >
                    Delete subject
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
