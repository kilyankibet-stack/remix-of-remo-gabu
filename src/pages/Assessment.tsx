import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import targetIcon from '@/assets/target-icon.png';
import { CheckCircle2 } from 'lucide-react';

interface Question {
  id: number;
  type: 'arrange' | 'mcq' | 'classify';
  title: string;
  instruction: string;
  data: any;
  answer: string;
}

const questions: Question[] = [
  {
    id: 1, type: 'arrange', title: 'Arrange the Sentence',
    instruction: 'Put these words in the correct order to form a sentence:',
    data: { words: ['is', 'the', 'cat', 'sleeping'], hint: 'Tap the words in the correct order:' },
    answer: 'the cat is sleeping',
  },
  {
    id: 2, type: 'mcq', title: 'Content Classification',
    instruction: 'Which category best describes the following text?',
    data: {
      text: '"Breaking: Central Bank raises interest rates by 0.5% amid inflation concerns"',
      options: ['Entertainment', 'Finance & Economics', 'Sports', 'Technology'],
    },
    answer: 'Finance & Economics',
  },
  {
    id: 3, type: 'arrange', title: 'Arrange the Sentence',
    instruction: 'Put these words in the correct order:',
    data: { words: ['quickly', 'the', 'ran', 'dog', 'very'], hint: 'Tap the words in the correct order:' },
    answer: 'the dog ran very quickly',
  },
  {
    id: 4, type: 'mcq', title: 'Sentiment Analysis',
    instruction: 'What is the sentiment of this text?',
    data: {
      text: '"I absolutely loved the new restaurant! The food was incredible and the service was outstanding."',
      options: ['Negative', 'Neutral', 'Positive', 'Mixed'],
    },
    answer: 'Positive',
  },
  {
    id: 5, type: 'classify', title: 'Data Categorization',
    instruction: 'Which label best fits this data entry?',
    data: {
      text: 'Item: Nike Air Max 90, Price: $120, Color: White/Black, Size: US 10',
      options: ['Food & Beverage', 'Footwear / Apparel', 'Electronics', 'Automotive'],
    },
    answer: 'Footwear / Apparel',
  },
  {
    id: 6, type: 'mcq', title: 'Pattern Recognition',
    instruction: 'What comes next in the sequence?',
    data: {
      text: '2, 6, 18, 54, ?',
      options: ['108', '162', '72', '216'],
    },
    answer: '162',
  },
];

const Assessment = () => {
  const navigate = useNavigate();
  const { setAssessmentDone } = useUserStore();
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(6).fill(''));
  const [arrangeSelected, setArrangeSelected] = useState<string[]>([]);

  if (!started) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="w-28 h-28 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
            <img src={targetIcon} alt="Assessment" width={80} height={80} />
          </div>
          <h1 className="text-2xl font-bold text-foreground text-center">Welcome to</h1>
          <h2 className="text-2xl font-bold text-foreground text-center">AI Training Assessment</h2>

          <div className="w-full bg-card rounded-xl p-6 mt-8 border border-border">
            <p className="text-muted-foreground text-sm mb-4">Complete this quick assessment to verify your skills in:</p>
            {['Text annotation & labeling', 'Sentence arrangement', 'Content classification', 'Data categorization', 'Pattern recognition'].map((s) => (
              <div key={s} className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-foreground text-sm font-medium">{s}</span>
              </div>
            ))}
            <p className="text-accent-foreground text-sm mt-4">This will only take 2-3 minutes!</p>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="w-full gradient-primary text-primary-foreground font-semibold py-4 rounded-xl mt-8 text-lg glow-primary"
          >
            Start Assessment →
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];

  const handleArrangeWord = (word: string) => {
    if (arrangeSelected.includes(word)) {
      setArrangeSelected(arrangeSelected.filter((w) => w !== word));
    } else {
      const newSel = [...arrangeSelected, word];
      setArrangeSelected(newSel);
      const updated = [...answers];
      updated[current] = newSel.join(' ');
      setAnswers(updated);
    }
  };

  const handleMcq = (option: string) => {
    const updated = [...answers];
    updated[current] = option;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (current < 5) {
      setCurrent(current + 1);
      setArrangeSelected([]);
    } else {
      let correct = 0;
      answers.forEach((a, i) => {
        if (a.toLowerCase().trim() === questions[i].answer.toLowerCase()) correct++;
      });
      setAssessmentDone();
      navigate('/results', { state: { correct, total: 6 } });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-4 py-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card rounded-lg p-3 text-center border border-border">
          <span className="text-foreground font-semibold text-sm">Question {current + 1} of 6</span>
        </div>

        <div className="bg-card rounded-xl p-6 mt-4 border border-border">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center mb-4">
            <span className="text-primary-foreground font-bold">{q.id}</span>
          </div>
          <h3 className="text-lg font-bold text-foreground">{q.title}</h3>
          <p className="text-muted-foreground text-sm mt-1">{q.instruction}</p>

          {q.type === 'arrange' && (
            <div className="mt-4">
              <p className="text-muted-foreground text-xs mb-3">{q.data.hint}</p>
              <div className="grid grid-cols-2 gap-3">
                {q.data.words.map((w: string) => (
                  <button
                    key={w}
                    onClick={() => handleArrangeWord(w)}
                    className={`px-4 py-4 rounded-xl border text-sm font-semibold transition-all ${
                      arrangeSelected.includes(w)
                        ? 'bg-primary/20 border-primary text-accent-foreground scale-95'
                        : 'bg-secondary border-border text-foreground'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
              <div className="mt-4 bg-accent/30 border border-primary/30 rounded-xl px-4 py-3 min-h-[48px]">
                <span className="text-muted-foreground text-sm">
                  {arrangeSelected.length > 0 ? arrangeSelected.join(' ') : 'Your answer: (tap words above)'}
                </span>
              </div>
            </div>
          )}

          {(q.type === 'mcq' || q.type === 'classify') && (
            <div className="mt-4">
              {q.data.text && (
                <div className="bg-secondary rounded-lg p-3 mb-4">
                  <p className="text-foreground text-sm italic">{q.data.text}</p>
                </div>
              )}
              <div className="space-y-2">
                {q.data.options.map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => handleMcq(opt)}
                    className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                      answers[current] === opt
                        ? 'bg-primary/20 border-primary text-accent-foreground'
                        : 'bg-secondary border-border text-foreground'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          className="w-full gradient-success text-success-foreground font-semibold py-4 rounded-xl mt-6 text-lg glow-success"
        >
          {current < 5 ? 'Next Question →' : 'Submit Assessment →'}
        </button>
      </div>
    </div>
  );
};

export default Assessment;
