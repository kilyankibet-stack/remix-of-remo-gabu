import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import PlansModal from '@/components/PlansModal';

const surveyQuestions: Record<string, { title: string; reward: number; questions: { q: string; options: string[]; correct: string }[] }> = {
  'data-cat': {
    title: 'Data Categorization Survey',
    reward: 2.15,
    questions: [
      { q: 'A dataset contains customer purchase history with timestamps, product IDs, and amounts. Which data structure would be most efficient for querying the top 10 products by revenue in the last 30 days?', options: ['Hash Map', 'B-Tree Index', 'Heap', 'Linked List'], correct: 'B-Tree Index' },
      { q: 'In a healthcare dataset, patient records contain fields: diagnosis_code (ICD-10), treatment_plan, and outcome. How should you categorize a record with code "J45.20"?', options: ['Cardiovascular Disease', 'Mild Intermittent Asthma', 'Type 2 Diabetes', 'Chronic Kidney Disease'], correct: 'Mild Intermittent Asthma' },
      { q: 'When categorizing financial transactions, which would be classified as a "capital expenditure"?', options: ['Monthly rent payment', 'Purchase of manufacturing equipment', 'Employee salary', 'Utility bill payment'], correct: 'Purchase of manufacturing equipment' },
      { q: 'A social media post reads: "Just got my quarterly earnings report 📈 Our team crushed it this Q3!" What category best fits?', options: ['Personal Finance', 'Corporate/Business Update', 'Investment Advice', 'Job Recruitment'], correct: 'Corporate/Business Update' },
      { q: 'An article about "Tesla recalling 2 million vehicles due to autopilot safety concerns" should be tagged with which categories?', options: ['Technology + Safety', 'Automotive + Technology + Safety', 'Business + Automotive', 'Science + Innovation'], correct: 'Automotive + Technology + Safety' },
      { q: 'Where would you categorize "Bluetooth-enabled smart water bottle with temperature tracking"?', options: ['Electronics > Accessories', 'Kitchen & Dining > Drinkware', 'Smart Home > Health & Wellness', 'Sports & Outdoors > Hydration'], correct: 'Smart Home > Health & Wellness' },
      { q: 'A review states: "The product is 素晴らしい but shipping was terrible." How should the sentiment be categorized?', options: ['Positive', 'Negative', 'Mixed', 'Cannot determine without translation'], correct: 'Mixed' },
      { q: 'Coordinates (1.3521° N, 103.8198° E) with entry "hawker centre" should be categorized under which region?', options: ['Malaysia - Restaurant', 'Singapore - Food Court/Street Food', 'Indonesia - Market', 'Thailand - Food Stall'], correct: 'Singapore - Food Court/Street Food' },
      { q: 'A response with status code 429 and message "Rate limit exceeded" falls under which category?', options: ['Authentication Error', 'Server Error', 'Client-Side Throttling', 'Network Timeout'], correct: 'Client-Side Throttling' },
      { q: 'A paper about "CRISPR-Cas9 gene editing for drought-resistant wheat" belongs to which classification?', options: ['Medicine - Genetics', 'Agriculture - Biotechnology', 'Computer Science - Bioinformatics', 'Environmental Science'], correct: 'Agriculture - Biotechnology' },
    ],
  },
  'pattern': {
    title: 'Pattern Recognition Survey',
    reward: 3.15,
    questions: [
      { q: 'Given the sequence: 1, 1, 2, 3, 5, 8, 13, 21, ?, what comes next?', options: ['29', '34', '32', '36'], correct: '34' },
      { q: 'Daily stock prices: $100, $102, $99, $103, $97, $105, $95. The trend pattern is:', options: ['Upward trend', 'Downward trend', 'Increasing volatility with slight upward bias', 'Mean reversion'], correct: 'Increasing volatility with slight upward bias' },
      { q: 'Network traffic spikes every 3.7 seconds with 1024-byte payloads. This indicates:', options: ['Normal browsing', 'Video streaming', 'Automated bot/beacon activity', 'File download'], correct: 'Automated bot/beacon activity' },
      { q: 'In the sequence A1, C3, F6, J10, ?, identify the next element:', options: ['N14', 'O15', 'M13', 'P16'], correct: 'O15' },
      { q: 'Sensor readings: [2.3, 2.3, 2.4, 2.3, 8.9, 2.3, 2.4]. The 8.9 should be classified as:', options: ['Normal variation', 'Point anomaly', 'Contextual anomaly', 'Collective anomaly'], correct: 'Point anomaly' },
      { q: 'Matrix [[1,2],[3,4]] → [[4,3],[2,1]]. What transformation was applied?', options: ['Transpose', 'Rotate 90°', 'Rotate 180°', 'Mirror horizontally'], correct: 'Rotate 180°' },
      { q: 'In DNA, the pattern ATCGATCGATCG represents:', options: ['Random sequence', 'Tandem repeat of ATCG', 'Palindromic sequence', 'Complementary strand'], correct: 'Tandem repeat of ATCG' },
      { q: 'Retail sales: Mon=100, Tue=120, Wed=110, Thu=130, Fri=200, Sat=250, Sun=180. What seasonality?', options: ['Monthly', 'Weekly with weekend peak', 'Daily', 'Quarterly'], correct: 'Weekly with weekend peak' },
      { q: 'Binary 10110100 XOR 11001010 produces:', options: ['01111110', '01001100', '11111110', '01100010'], correct: '01111110' },
      { q: 'Silhouette coefficient of -0.15 indicates:', options: ['Perfect clustering', 'Good clustering', 'Poor clustering - wrong cluster assignments', 'Insufficient data'], correct: 'Poor clustering - wrong cluster assignments' },
    ],
  },
  'sentence': {
    title: 'Sentence Arrangement Survey',
    reward: 1.80,
    questions: [
      { q: 'Arrange: (A) Experiment conducted (B) Hypothesis formulated (C) Results analyzed (D) Research question identified', options: ['D, B, A, C', 'A, B, C, D', 'B, A, D, C', 'D, A, B, C'], correct: 'D, B, A, C' },
      { q: 'Order: (1) Renewable energy adoption accelerated (2) Temperatures rose 1.5°C (3) Paris Agreement signed (4) Scientific evidence mounted', options: ['4, 2, 3, 1', '2, 4, 3, 1', '1, 2, 3, 4', '3, 4, 2, 1'], correct: '4, 2, 3, 1' },
      { q: 'Container deployment steps: (A) Push to registry (B) Write Dockerfile (C) Configure orchestration (D) Build image', options: ['B, D, A, C', 'A, B, C, D', 'D, B, A, C', 'B, A, D, C'], correct: 'B, D, A, C' },
      { q: 'Logical argument: (P) All mammals are warm-blooded (Q) Therefore, whales are warm-blooded (R) Whales are mammals', options: ['P, R, Q', 'Q, P, R', 'R, P, Q', 'P, Q, R'], correct: 'P, R, Q' },
      { q: 'Database operations: (1) COMMIT (2) BEGIN (3) INSERT records (4) Validate integrity', options: ['2, 3, 4, 1', '2, 4, 3, 1', '3, 4, 2, 1', '4, 2, 3, 1'], correct: '2, 3, 4, 1' },
      { q: 'SDLC phases: (A) Deployment (B) Requirements (C) Testing (D) Design (E) Implementation', options: ['B, D, E, C, A', 'B, E, D, C, A', 'D, B, E, C, A', 'B, D, C, E, A'], correct: 'B, D, E, C, A' },
      { q: 'Incident response: (1) Contain threat (2) Identify breach (3) Document (4) Eradicate (5) Recover', options: ['2, 1, 4, 5, 3', '1, 2, 3, 4, 5', '2, 4, 1, 5, 3', '1, 2, 4, 5, 3'], correct: '2, 1, 4, 5, 3' },
      { q: 'Economic events: (A) Hyperinflation (B) Excess currency printed (C) Confidence drops (D) Prices skyrocket', options: ['B, D, A, C', 'C, B, A, D', 'B, A, D, C', 'A, B, C, D'], correct: 'B, D, A, C' },
      { q: 'ML pipeline: (1) Deploy (2) Collect data (3) Feature engineering (4) Train (5) Evaluate', options: ['2, 3, 4, 5, 1', '2, 4, 3, 5, 1', '3, 2, 4, 5, 1', '2, 3, 5, 4, 1'], correct: '2, 3, 4, 5, 1' },
      { q: 'Academic citation order: (A) Year (B) Author (C) Pages (D) Journal (E) Title', options: ['B, A, E, D, C', 'A, B, C, D, E', 'B, E, D, A, C', 'E, B, A, D, C'], correct: 'B, A, E, D, C' },
    ],
  },
  'image': {
    title: 'Image Labeling Survey',
    reward: 1.88,
    questions: [
      { q: 'Satellite imagery: 50m x 50m area with mixed vegetation and concrete should be classified as:', options: ['Commercial zone', 'Residential suburban', 'Mixed-use urban', 'Industrial zone'], correct: 'Mixed-use urban' },
      { q: 'Chest X-ray with bilateral ground-glass opacities indicates:', options: ['Pneumothorax', 'Pneumonia or ARDS', 'Pleural effusion', 'Cardiomegaly'], correct: 'Pneumonia or ARDS' },
      { q: 'Object at 45° angle, 30m distance, partially occluded should be labeled with:', options: ['High confidence', 'Medium confidence - partially occluded', 'Low confidence', 'Skip'], correct: 'Medium confidence - partially occluded' },
      { q: 'Critical facial landmarks for pose estimation:', options: ['Hairline and chin', 'Eye corners, nose tip, mouth corners', 'Ear positions only', 'Eyebrow centers'], correct: 'Eye corners, nose tip, mouth corners' },
      { q: 'Surface scratch 0.5mm x 15mm on metal should be classified as:', options: ['Cosmetic - acceptable', 'Minor structural defect', 'Critical structural defect', 'Measurement artifact'], correct: 'Minor structural defect' },
      { q: 'Boundary between sidewalk and road should be annotated with:', options: ['Hard boundary 1px precision', 'Soft boundary with transition', 'Only road surface', 'Only sidewalk'], correct: 'Hard boundary 1px precision' },
      { q: 'Blurred night camera trap image with striped pattern ~1m height should be tagged:', options: ['Unknown - insufficient data', 'Zebra - high confidence', 'Tiger - possible', 'Deer - likely'], correct: 'Unknown - insufficient data' },
      { q: 'Plate with rice, chicken, and vegetables needs how many bounding boxes?', options: ['1 - entire plate', '3 - one per food item', '4+ including individual vegs', 'Semantic segmentation instead'], correct: '3 - one per food item' },
      { q: 'Slightly rotated (5°) handwritten form should be:', options: ['Rejected', 'Deskewed then labeled', 'Labeled as-is with rotation noted', 'Augmented'], correct: 'Deskewed then labeled' },
      { q: 'Product facing backward (barcode visible, label hidden) should be:', options: ['Correct placement', 'Facing wrong direction', 'Out of stock', 'Misplaced'], correct: 'Facing wrong direction' },
    ],
  },
  'sentiment': {
    title: 'Sentiment Analysis Survey',
    reward: 2.30,
    questions: [
      { q: '"The product works exactly as described, nothing more nothing less." Sentiment?', options: ['Positive', 'Negative', 'Neutral/Factual', 'Mixed'], correct: 'Neutral/Factual' },
      { q: '"I can\'t believe how terrible this amazing feature turned out to be." This is:', options: ['Positive', 'Negative with sarcasm', 'Contradictory/mixed', 'Neutral'], correct: 'Contradictory/mixed' },
      { q: '"Camera quality is stunning but battery life is abysmal." How many sentiment targets?', options: ['1 - negative', '1 - positive', '2 - camera(+) battery(-)', '3 targets'], correct: '2 - camera(+) battery(-)' },
      { q: '"This restaurant has been in business for 50 years." This expresses:', options: ['Implicit positive', 'Explicit positive', 'No sentiment - factual', 'Implicit negative'], correct: 'No sentiment - factual' },
      { q: '"Sure, the $2000 phone does make calls." Pragmatic sentiment:', options: ['Positive', 'Sarcastic/negative - poor value', 'Neutral', 'Cannot determine'], correct: 'Sarcastic/negative - poor value' },
      { q: '"C\'est pas mal" (French: "It\'s not bad") should be classified as:', options: ['Negative', 'Mildly positive (litotes)', 'Neutral', 'Strongly positive'], correct: 'Mildly positive (litotes)' },
      { q: '5 stars but writes "Forced to buy, no alternatives." Sentiment is:', options: ['Positive (5 stars)', 'Negative (forced)', 'Rating-text mismatch - prioritize text', 'Neutral'], correct: 'Rating-text mismatch - prioritize text' },
      { q: '"Compared to last year, this version is slightly better." Comparative sentiment:', options: ['Strong positive', 'Weak/qualified positive', 'Negative', 'Neutral'], correct: 'Weak/qualified positive' },
      { q: '"Company reported Q3 earnings above expectations" in financial analysis:', options: ['Positive', 'Neutral factual', 'Bullish sentiment', 'Depends on context'], correct: 'Bullish sentiment' },
      { q: '"AI art was breathtaking, which made human artists furious." Entity-level:', options: ['Overall positive', 'Art: positive, Artists: negative emotion', 'Mixed for all', 'Cannot separate'], correct: 'Art: positive, Artists: negative emotion' },
    ],
  },
  'code-review': {
    title: 'Code Review Survey',
    reward: 2.55,
    questions: [
      { q: 'Function with cyclomatic complexity of 15. Recommended action?', options: ['Acceptable', 'Refactor into smaller functions', 'Add comments', 'More test coverage'], correct: 'Refactor into smaller functions' },
      { q: 'Python code: `eval(user_input)`. Severity level:', options: ['Low - style', 'Medium - performance', 'Critical - code injection', 'Info - docs needed'], correct: 'Critical - code injection' },
      { q: 'JavaScript using `==` instead of `===`. Classified as:', options: ['Bug', 'Code smell / Best practice violation', 'Security vulnerability', 'Performance issue'], correct: 'Code smell / Best practice violation' },
      { q: 'REST API returns 200 OK with error message in body. Issue:', options: ['No issue', 'Improper HTTP status code usage', 'Security concern', 'Documentation mismatch'], correct: 'Improper HTTP status code usage' },
      { q: 'Database query inside a loop processing 10,000 records. Known as:', options: ['Batch processing', 'N+1 query problem', 'Connection pooling', 'Lazy loading'], correct: 'N+1 query problem' },
      { q: 'React useEffect with no dependency array. Implication:', options: ['Runs once on mount', 'Runs on every render', 'Never runs', 'Only on unmount'], correct: 'Runs on every render' },
      { q: 'Try-catch catching base Exception and only logging. Finding:', options: ['Good error handling', 'Pokemon exception - too broad', 'Missing finally', 'Use checked exceptions'], correct: 'Pokemon exception - too broad' },
      { q: 'Function with 12 parameters. Refactoring approach:', options: ['Default values', 'Configuration object/builder pattern', 'Split into two', 'Add documentation'], correct: 'Configuration object/builder pattern' },
      { q: 'Hardcoded API key: `const API_KEY = "sk-abc123..."`. Fix priority:', options: ['Low', 'Medium - config file', 'Critical - env vars/secrets manager', 'Info - gitignore'], correct: 'Critical - env vars/secrets manager' },
      { q: 'Multi-threaded app with `counter++`. Issue:', options: ['No issue', 'Race condition - not atomic', 'Memory leak', 'Deadlock potential'], correct: 'Race condition - not atomic' },
    ],
  },
  'translation': {
    title: 'Translation Task Survey',
    reward: 2.12,
    questions: [
      { q: 'Translating "It\'s raining cats and dogs" - correct approach:', options: ['Literal', 'Find equivalent idiom', 'Literal with footnote', 'Omit'], correct: 'Find equivalent idiom' },
      { q: '"お疲れ様です" in business context translates to:', options: ['"You look tired"', '"Thank you for your hard work"', '"Hello"', '"Goodbye"'], correct: '"Thank you for your hard work"' },
      { q: '"Se me cayó el teléfono" (Spanish reflexive). Natural English:', options: ['"Phone fell itself"', '"I dropped my phone" (accidental)', '"My phone fell"', '"I made it fall"'], correct: '"I dropped my phone" (accidental)' },
      { q: 'Technical term "machine learning" should be:', options: ['Always translated', 'Kept in English', 'Transliterated', 'Depends on locale conventions'], correct: 'Depends on locale conventions' },
      { q: 'Arabic text is RTL. UI string translation needs:', options: ['Just translate', 'Mirror layout (RTL)', 'Add direction markers', 'Both layout mirroring and bidi handling'], correct: 'Both layout mirroring and bidi handling' },
      { q: '"Schadenfreude" (German) with no English equivalent. Best approach:', options: ['Skip', 'Use German word with explanation', 'Translate as "happiness"', 'Circumlocution: "pleasure from others\' misfortune"'], correct: 'Circumlocution: "pleasure from others\' misfortune"' },
      { q: 'Recipe: "350°F" for European audience should be:', options: ['Keep as 350°F', 'Convert to ~175°C', 'Remove', 'Both: 350°F (175°C)'], correct: 'Both: 350°F (175°C)' },
      { q: 'Legal term "reasonable doubt" should be translated:', options: ['Closest common equivalent', 'Established legal term in target jurisdiction', 'Literally', 'With translator note'], correct: 'Established legal term in target jurisdiction' },
      { q: 'Chinese "龙" (dragon) for Western audiences - adjust connotation?', options: ['No - literal', 'Yes - note cultural difference', 'Replace with Western equivalent', 'Omit'], correct: 'Yes - note cultural difference' },
      { q: 'Date MM/DD/YYYY for global audience. ISO standard is:', options: ['DD/MM/YYYY', 'YYYY-MM-DD', 'YYYY/DD/MM', 'DD-MM-YYYY'], correct: 'YYYY-MM-DD' },
    ],
  },
  'refer': {
    title: 'Refer & Earn Survey',
    reward: 2.35,
    questions: [
      { q: 'Best metric to measure referral quality vs organic users:', options: ['Sign-ups', 'Customer Lifetime Value (CLV)', 'Click-through rate', 'Time to purchase'], correct: 'Customer Lifetime Value (CLV)' },
      { q: 'Two-sided referral program primary risk:', options: ['Low participation', 'Referral fraud/gaming', 'High costs', 'User confusion'], correct: 'Referral fraud/gaming' },
      { q: 'Viral coefficient if each user refers 3 people and 20% convert:', options: ['0.2', '0.6', '3.0', '1.5'], correct: '0.6' },
      { q: '"Product-led referral" means:', options: ['Paying for ads', 'Product naturally encourages sharing', 'Cold calling', 'Email campaigns'], correct: 'Product naturally encourages sharing' },
      { q: 'Which reward structure generates highest long-term engagement?', options: ['One-time cash', 'Tiered rewards increasing with count', 'Percentage of earnings', 'Random lottery'], correct: 'Tiered rewards increasing with count' },
      { q: 'Dropbox referral program reward mechanism:', options: ['Cash', 'Extra storage for both', 'Premium discount', 'Gift cards'], correct: 'Extra storage for both' },
      { q: 'Most effective referral abuse prevention:', options: ['Email verification', 'Phone + device fingerprint + activity threshold', 'CAPTCHA', 'IP checking'], correct: 'Phone + device fingerprint + activity threshold' },
      { q: '"Referral fatigue" is best addressed by:', options: ['Increase rewards', 'Introduce gamification and new incentives', 'Cap the program', 'Improve platform'], correct: 'Introduce gamification and new incentives' },
      { q: '"Last-touch attribution" means:', options: ['Credit to first referrer', 'Credit to most recent source', 'Credit split equally', 'No credit'], correct: 'Credit to most recent source' },
      { q: 'Optimal timing for referral prompt:', options: ['Immediately after signup', 'After key value moment (aha moment)', 'After 30 days', 'When contacting support'], correct: 'After key value moment (aha moment)' },
    ],
  },
  'audio-transcript': {
    title: 'Audio Transcription Survey',
    reward: 2.75,
    questions: [
      { q: 'Audio with background noise - best practice:', options: ['Skip unclear sections', 'Mark with [inaudible] timestamp', 'Guess from context', 'Only transcribe clear speech'], correct: 'Mark with [inaudible] timestamp' },
      { q: 'Verbatim transcription - filler words "um," "uh" should be:', options: ['Always removed', 'Always included as spoken', 'Only if affecting meaning', 'Replaced with ellipses'], correct: 'Always included as spoken' },
      { q: '"gonna" and "wanna" in formal interview. Clean verbatim requires:', options: ['Keep as spoken', 'Convert to "going to" and "want to"', 'Flag for review', 'Use both'], correct: 'Convert to "going to" and "want to"' },
      { q: 'Multiple speakers overlap. Correct format:', options: ['Only loudest speaker', 'Use [crosstalk] and transcribe both', 'Skip overlap', 'Combine into one line'], correct: 'Use [crosstalk] and transcribe both' },
      { q: 'Minimum sampling rate for clear speech transcription:', options: ['8 kHz', '16 kHz', '44.1 kHz', '96 kHz'], correct: '16 kHz' },
      { q: 'Medical: "patient presents with SOB" should expand to:', options: ['Keep as SOB', 'Shortness of breath', 'Flag inappropriate', 'Standard operating baseline'], correct: 'Shortness of breath' },
      { q: 'Speaker diarization refers to:', options: ['Removing noise', 'Identifying different speakers', 'Converting speech to text', 'Adding timestamps'], correct: 'Identifying different speakers' },
      { q: 'False start: "I went to the— I drove to the store." Clean transcript:', options: ['Keep original', '"I drove to the store"', '"I went to the store"', '[false start] version'], correct: '"I drove to the store"' },
      { q: 'Standard professional transcription accuracy rate:', options: ['85%', '90%', '95-99%', '100%'], correct: '95-99%' },
      { q: 'Non-verbal sounds [laughter], [applause] should be:', options: ['Always omitted', 'Included in brackets when relevant', 'In footnotes', 'Only if requested'], correct: 'Included in brackets when relevant' },
    ],
  },
  'fact-check': {
    title: 'Fact Checking Survey',
    reward: 3.00,
    questions: [
      { q: '"Humans only use 10% of their brains." This claim is:', options: ['True', 'False - persistent neuromyth', 'Partially true', 'Unverifiable'], correct: 'False - persistent neuromyth' },
      { q: 'Most reliable primary source for mortality statistics:', options: ['Wikipedia', 'News articles', 'WHO or national health agencies', 'Social media'], correct: 'WHO or national health agencies' },
      { q: 'Real graph with manipulated Y-axis scale. This is:', options: ['Acceptable', 'Misleading presentation of real data', 'Fabrication', 'Standard practice'], correct: 'Misleading presentation of real data' },
      { q: '"Studies show coffee prevents cancer." Fact-check approach:', options: ['Accept if reputable outlet', 'Find original studies, check methodology', 'Reject - too good', 'Check other articles'], correct: 'Find original studies, check methodology' },
      { q: '"Correlation ≠ causation" applies when:', options: ['"Water boils at 100°C"', '"More ice cream = more drownings, so ice cream causes drowning"', '"Earth orbits Sun"', '"Vaccines contain ingredients"'], correct: '"More ice cream = more drownings, so ice cream causes drowning"' },
      { q: 'Political claim using 2015 data for current economy. This is:', options: ['Good context', 'Cherry-picking outdated data', 'Proper citation', 'Time series analysis'], correct: 'Cherry-picking outdated data' },
      { q: '"Peer-reviewed" means:', options: ['Reviewed by friends', 'Evaluated by field experts before publication', 'Government approved', 'AI checked'], correct: 'Evaluated by field experts before publication' },
      { q: '"Insanity is doing the same thing expecting different results" attributed to Einstein:', options: ['Verified quote', 'Misattributed - no evidence', 'From his papers', 'A paraphrase'], correct: 'Misattributed - no evidence' },
      { q: 'Reverse image search helps determine:', options: ['Image quality', 'Original source and context accuracy', 'Camera settings', 'File size'], correct: 'Original source and context accuracy' },
      { q: '"Experts say" without naming experts. This is:', options: ['Standard journalism', 'Red flag - weasel words', 'Source protection', 'Academic style'], correct: 'Red flag - weasel words' },
    ],
  },
  'content-mod': {
    title: 'Content Moderation Survey',
    reward: 2.10,
    questions: [
      { q: 'Photo of legal hunting trip. Under standard policies:', options: ['Always remove', 'Generally allowed with context', 'Flag as violent', 'Depends on platform policy'], correct: 'Depends on platform policy' },
      { q: 'Sarcastic hate speech "Oh sure, ALL [group] are SO intelligent":', options: ['Allowed - sarcasm', 'Removed', 'Flagged for review - context matters', 'Ignored'], correct: 'Flagged for review - context matters' },
      { q: 'News article about terrorist attack with graphic descriptions:', options: ['Remove entirely', 'Allow as newsworthy with content warning', 'Remove graphic details', 'Ban publisher'], correct: 'Allow as newsworthy with content warning' },
      { q: 'Child in public park photo, no inappropriate context:', options: ['Remove - children never', 'Allow - normal public content', 'Flag for child safety', 'Require consent proof'], correct: 'Allow - normal public content' },
      { q: '"Drink bleach to cure COVID" post should be:', options: ['Labeled as opinion', 'Removed immediately - dangerous misinfo', 'Allowed with disclaimer', 'Fact-checked and labeled'], correct: 'Removed immediately - dangerous misinfo' },
      { q: '"Brigading" in content moderation means:', options: ['Multiple accounts', 'Coordinated group targeting', 'Posting spam', 'Sharing copyrighted content'], correct: 'Coordinated group targeting' },
      { q: 'Deepfake celebrity product endorsement. Priority:', options: ['Low - entertainment', 'High - deceptive synthetic media', 'Medium - parody', 'No action'], correct: 'High - deceptive synthetic media' },
      { q: 'After reviewing disturbing content, protocol is:', options: ['Continue working', 'Mandatory wellness break and counseling', 'Switch task type', 'Log off'], correct: 'Mandatory wellness break and counseling' },
      { q: 'Private group post discussing self-harm. Approach:', options: ['Ignore - private group', 'Provide crisis resources, review for risk', 'Remove and ban', 'Only if reported'], correct: 'Provide crisis resources, review for risk' },
      { q: 'AI content moderation is best used for:', options: ['All decisions', 'Pre-filtering with human review for edge cases', 'Replacing humans', 'Only text'], correct: 'Pre-filtering with human review for edge cases' },
    ],
  },
  'data-entry': {
    title: 'Data Entry Survey',
    reward: 1.65,
    questions: [
      { q: 'Date "03/04/2025" without regional context. Safest approach:', options: ['Assume MM/DD/YYYY', 'Assume DD/MM/YYYY', 'Flag as ambiguous and verify', 'Use system default'], correct: 'Flag as ambiguous and verify' },
      { q: 'Name "O\'Brien-Smith." Correct entry format:', options: ['Obrien Smith', 'O Brien-Smith', 'O\'Brien-Smith (preserve punctuation)', 'OBrien-Smith'], correct: 'O\'Brien-Smith (preserve punctuation)' },
      { q: '"1,234.56" and "1.234,56" represent:', options: ['Same number, different locales', 'Different numbers', 'First is incorrect', 'Second is incorrect'], correct: 'Same number, different locales' },
      { q: 'Source document shows age: 250. Correct action:', options: ['Enter as written', 'Correct to reasonable value', 'Flag for verification without changing', 'Skip record'], correct: 'Flag for verification without changing' },
      { q: 'Professional data entry accuracy rate:', options: ['90%', '95%', '99%+', '100% always'], correct: '99%+' },
      { q: '"123 Main St., Apt. 4B, New York, NY 10001" should be parsed into:', options: ['One field', 'Street, unit, city, state, ZIP separately', 'Street and city only', 'Whatever fits'], correct: 'Street, unit, city, state, ZIP separately' },
      { q: 'Duplicate detection is important because:', options: ['Saves storage', 'Causes reporting errors and poor experience', 'Legal requirement', 'Speeds up entry'], correct: 'Causes reporting errors and poor experience' },
      { q: 'OCR shows "rn" where "m" should be. This is:', options: ['Character substitution', 'Ligature confusion', 'Kerning error', 'Font mismatch'], correct: 'Ligature confusion' },
      { q: 'Illegible handwritten text should be:', options: ['Best-guessed', 'Entered as [illegible] or flagged', 'Skipped entirely', 'Entered as blank'], correct: 'Entered as [illegible] or flagged' },
      { q: 'Email check for "@" and domain is:', options: ['Format validation', 'Business logic validation', 'Cross-field validation', 'Range validation'], correct: 'Format validation' },
    ],
  },
  'text-summary': {
    title: 'Text Summarization Survey',
    reward: 2.80,
    questions: [
      { q: 'What is the ideal compression ratio for an executive summary of a 10-page report?', options: ['10:1 (1 page)', '5:1 (2 pages)', '20:1 (half page)', 'Depends on content density'], correct: 'Depends on content density' },
      { q: 'Extractive summarization differs from abstractive in that it:', options: ['Creates new sentences', 'Selects existing sentences from the text', 'Uses AI language models', 'Is always shorter'], correct: 'Selects existing sentences from the text' },
      { q: 'When summarizing a scientific paper, which section is LEAST important to include?', options: ['Methodology', 'Results/Findings', 'Acknowledgments', 'Conclusions'], correct: 'Acknowledgments' },
      { q: 'A summary should never include:', options: ['Key statistics', 'Author\'s main argument', 'The summarizer\'s personal opinion', 'Important conclusions'], correct: 'The summarizer\'s personal opinion' },
      { q: '"The CEO resigned amid allegations of misconduct." Is this summary biased?', options: ['No - factual', 'Yes - "amid" implies causation', 'Depends on source', 'Cannot determine'], correct: 'Yes - "amid" implies causation' },
      { q: 'ROUGE score in text summarization measures:', options: ['Reading difficulty', 'Overlap between generated and reference summaries', 'Summary length', 'Grammar quality'], correct: 'Overlap between generated and reference summaries' },
      { q: 'For a legal document summary, what must always be preserved?', options: ['All proper nouns', 'Specific dates, amounts, and obligations', 'Paragraph structure', 'Legal jargon'], correct: 'Specific dates, amounts, and obligations' },
      { q: 'Multi-document summarization faces what unique challenge?', options: ['Longer output', 'Handling redundancy and contradictions across sources', 'Harder to read', 'More expensive'], correct: 'Handling redundancy and contradictions across sources' },
      { q: 'A "lead bias" in news summarization means:', options: ['Political bias in headlines', 'First paragraphs contain most important information', 'Editors prefer certain stories', 'Clickbait tendency'], correct: 'First paragraphs contain most important information' },
      { q: 'When summarizing dialogue/conversation, the priority is:', options: ['Preserve exact quotes', 'Capture key decisions and action items', 'Include all speakers equally', 'Maintain chronological order'], correct: 'Capture key decisions and action items' },
    ],
  },
  'email-class': {
    title: 'Email Classification Survey',
    reward: 2.05,
    questions: [
      { q: 'An email with subject "Re: Meeting rescheduled to Friday" should be classified as:', options: ['New request', 'Calendar/scheduling', 'FYI/informational', 'Action required'], correct: 'Calendar/scheduling' },
      { q: 'Email containing "Please find attached the Q3 report as discussed" is:', options: ['Spam', 'Follow-up with deliverable', 'Meeting request', 'Newsletter'], correct: 'Follow-up with deliverable' },
      { q: 'What makes email classification harder than document classification?', options: ['Emails are longer', 'Short text, informal language, and thread context', 'More categories needed', 'Privacy concerns'], correct: 'Short text, informal language, and thread context' },
      { q: '"Your account has been compromised - verify immediately at [link]" classification:', options: ['Urgent action required', 'Phishing attempt', 'Security notification', 'Account update'], correct: 'Phishing attempt' },
      { q: 'Auto-reply "I am out of office until Jan 5" should be classified as:', options: ['Informational', 'Auto-response/OOO', 'Rejection', 'Delayed response'], correct: 'Auto-response/OOO' },
      { q: 'Internal email about new dress code policy is:', options: ['HR/Policy update', 'Personal', 'Urgent', 'External communication'], correct: 'HR/Policy update' },
      { q: '"Thanks!" single-word reply email should be classified as:', options: ['Positive feedback', 'Acknowledgment/closure', 'Spam', 'Incomplete message'], correct: 'Acknowledgment/closure' },
      { q: 'Newsletter with "Unsubscribe" link at bottom:', options: ['Important notification', 'Marketing/promotional', 'Personal message', 'Transaction receipt'], correct: 'Marketing/promotional' },
      { q: 'Email thread with 15 replies. Classification should be based on:', options: ['First email only', 'Last email in thread', 'Overall thread topic and latest context', 'Subject line only'], correct: 'Overall thread topic and latest context' },
      { q: 'Invoice email from vendor with PDF attachment:', options: ['Spam', 'Financial/transactional', 'Marketing', 'Internal memo'], correct: 'Financial/transactional' },
    ],
  },
  'product-cat': {
    title: 'Product Categorization Survey',
    reward: 2.25,
    questions: [
      { q: '"Wireless noise-canceling headphones with built-in microphone" primary category:', options: ['Electronics > Audio', 'Electronics > Accessories', 'Office Supplies', 'Telecommunications'], correct: 'Electronics > Audio' },
      { q: 'A product listed as "organic bamboo toothbrush" should NOT be categorized under:', options: ['Health & Personal Care', 'Eco-Friendly Products', 'Electronics', 'Oral Care'], correct: 'Electronics' },
      { q: '"Smart LED light bulb with Alexa compatibility" - which attribute is most important for categorization?', options: ['Color temperature', 'Smart home compatibility', 'Wattage', 'Brand'], correct: 'Smart home compatibility' },
      { q: 'Cross-listing: "yoga mat" should appear in:', options: ['Only Sports & Fitness', 'Sports & Fitness AND Health & Wellness', 'Only Health & Wellness', 'Home & Garden'], correct: 'Sports & Fitness AND Health & Wellness' },
      { q: 'Product with no images and minimal description. Best practice:', options: ['Categorize based on title only', 'Flag for manual review', 'Assign to "Uncategorized"', 'Skip the product'], correct: 'Flag for manual review' },
      { q: '"USB-C to Lightning cable" primary categorization challenge:', options: ['Too many categories fit', 'Deciding between Cables, Phone Accessories, or Computer Accessories', 'No category exists', 'Price varies'], correct: 'Deciding between Cables, Phone Accessories, or Computer Accessories' },
      { q: 'Product taxonomy depth best practice:', options: ['2 levels max', '3-4 levels for balance', '7+ levels for precision', '1 level only'], correct: '3-4 levels for balance' },
      { q: '"Gluten-free chocolate chip cookies" requires which attribute tags?', options: ['Dietary: gluten-free, Type: cookies', 'Only food category', 'Allergen info only', 'Brand and price only'], correct: 'Dietary: gluten-free, Type: cookies' },
      { q: 'Seasonal product "Christmas tree ornaments" in July should be:', options: ['Removed from catalog', 'Categorized normally but marked seasonal', 'Placed in clearance', 'Hidden from search'], correct: 'Categorized normally but marked seasonal' },
      { q: 'When two categories equally apply, the tie-breaker should be:', options: ['Random selection', 'Customer search behavior and purchase intent', 'Alphabetical order', 'Most populated category'], correct: 'Customer search behavior and purchase intent' },
    ],
  },
  'grammar': {
    title: 'Grammar Correction Survey',
    reward: 1.95,
    questions: [
      { q: '"Their going to there house over they\'re." How many errors?', options: ['1', '2', '3', '0'], correct: '3' },
      { q: '"The data shows that..." - is this grammatically correct?', options: ['Yes - "data" is commonly singular', 'No - should be "data show"', 'Both are acceptable in modern English', 'Only in informal writing'], correct: 'Both are acceptable in modern English' },
      { q: '"Neither the manager nor the employees was aware." Correction:', options: ['No change needed', '"were aware" (verb agrees with nearest subject)', '"is aware"', '"has been aware"'], correct: '"were aware" (verb agrees with nearest subject)' },
      { q: 'Oxford comma: "I love my parents, Batman and Wonder Woman." Why is this ambiguous?', options: ['It\'s not ambiguous', 'Implies parents are Batman and Wonder Woman', 'Too many subjects', 'Missing period'], correct: 'Implies parents are Batman and Wonder Woman' },
      { q: '"Who vs whom": "To __ should I address this letter?"', options: ['who', 'whom', 'whoever', 'whomever'], correct: 'whom' },
      { q: '"The team have decided" vs "The team has decided." In American English:', options: ['"have" is correct', '"has" is correct (team is singular)', 'Both are wrong', 'Depends on context'], correct: '"has" is correct (team is singular)' },
      { q: '"Less" vs "fewer": "There are __ people here today."', options: ['less', 'fewer', 'Both are correct', 'lesser'], correct: 'fewer' },
      { q: 'Passive voice: "The cake was eaten by the children." Active equivalent:', options: ['"The children ate the cake"', '"The cake ate the children"', '"Eating was done by children"', '"The children eaten the cake"'], correct: '"The children ate the cake"' },
      { q: '"I could of gone to the store." The error is:', options: ['"could of" should be "could have"', 'Missing subject', 'Wrong tense', 'No error'], correct: '"could of" should be "could have"' },
      { q: 'Dangling modifier: "Walking to school, the rain started." Fix:', options: ['Add comma after school', '"While I was walking to school, the rain started"', '"Walking to school and the rain started"', 'No fix needed'], correct: '"While I was walking to school, the rain started"' },
    ],
  },
  'spam-detect': {
    title: 'Spam Detection Survey',
    reward: 2.15,
    questions: [
      { q: 'Email: "Congratulations! You\'ve won $1,000,000! Click here to claim." Classification:', options: ['Legitimate lottery', 'Spam/scam', 'Promotional', 'Uncertain'], correct: 'Spam/scam' },
      { q: 'Which feature is MOST indicative of spam in email headers?', options: ['Reply-To different from From address', 'HTML formatting', 'Multiple recipients', 'Attachment present'], correct: 'Reply-To different from From address' },
      { q: 'A message uses "fr33" instead of "free." This technique is called:', options: ['Encryption', 'Leetspeak/obfuscation to bypass filters', 'Abbreviation', 'Typo'], correct: 'Leetspeak/obfuscation to bypass filters' },
      { q: 'Bayesian spam filter works by:', options: ['Blocking known IP addresses', 'Calculating probability based on word frequencies', 'Checking sender reputation only', 'Scanning for viruses'], correct: 'Calculating probability based on word frequencies' },
      { q: 'False positive in spam detection means:', options: ['Spam marked as legitimate', 'Legitimate email marked as spam', 'Filter failure', 'No classification'], correct: 'Legitimate email marked as spam' },
      { q: '"Your package is delayed. Track here: bit.ly/x3kf9" from unknown sender:', options: ['Legitimate shipping update', 'Likely phishing/spam', 'Marketing email', 'Cannot determine'], correct: 'Likely phishing/spam' },
      { q: 'Spear phishing differs from regular phishing in:', options: ['Volume of emails', 'Targeted personalization using victim\'s info', 'Technical sophistication', 'Payment method requested'], correct: 'Targeted personalization using victim\'s info' },
      { q: 'Ham-to-spam ratio in training data should ideally be:', options: ['1:1', 'Representative of real-world distribution', 'More spam than ham', 'Only spam samples'], correct: 'Representative of real-world distribution' },
      { q: 'Image-based spam (text rendered as image) bypasses:', options: ['All filters', 'Text-based content analysis filters', 'IP blacklists', 'Authentication checks'], correct: 'Text-based content analysis filters' },
      { q: 'DKIM, SPF, and DMARC are:', options: ['Spam keywords', 'Email authentication protocols', 'Encryption methods', 'Filter algorithms'], correct: 'Email authentication protocols' },
    ],
  },
  'ad-relevance': {
    title: 'Ad Relevance Survey',
    reward: 2.40,
    questions: [
      { q: 'User searches "best running shoes 2025." An ad for hiking boots is:', options: ['Highly relevant', 'Somewhat relevant - both are footwear', 'Not relevant - different use case', 'Irrelevant'], correct: 'Somewhat relevant - both are footwear' },
      { q: 'CTR (Click-Through Rate) primarily measures:', options: ['Revenue generated', 'How often users click on an ad after seeing it', 'Ad placement quality', 'Brand awareness'], correct: 'How often users click on an ad after seeing it' },
      { q: 'Retargeting an ad to a user who already purchased the product is:', options: ['Good practice', 'Wasteful - poor frequency capping', 'Required by law', 'Best for brand building'], correct: 'Wasteful - poor frequency capping' },
      { q: 'Ad showing baby products to a college student. Issue:', options: ['Wrong demographic targeting', 'Creative quality', 'Budget allocation', 'No issue - broad reach'], correct: 'Wrong demographic targeting' },
      { q: 'What is "ad fatigue"?', options: ['User blocks all ads', 'Decreasing engagement from repeated ad exposure', 'Advertiser burnout', 'Server overload'], correct: 'Decreasing engagement from repeated ad exposure' },
      { q: 'Native advertising should be labeled because:', options: ['It performs better with labels', 'FTC requires disclosure of sponsored content', 'It reduces click fraud', 'Advertisers prefer it'], correct: 'FTC requires disclosure of sponsored content' },
      { q: 'Quality Score in Google Ads includes:', options: ['Only bid amount', 'CTR, ad relevance, and landing page experience', 'Only keywords', 'Budget only'], correct: 'CTR, ad relevance, and landing page experience' },
      { q: 'A/B testing ad creatives should change:', options: ['Everything at once', 'One element at a time for clear attribution', 'Nothing - test budget only', 'Only the headline'], correct: 'One element at a time for clear attribution' },
      { q: 'Ad for a local restaurant shown to users 500 miles away:', options: ['Good brand exposure', 'Poor geo-targeting', 'Normal practice', 'Depends on chain size'], correct: 'Poor geo-targeting' },
      { q: 'Ad viewability standard (IAB): display ad must be:', options: ['100% visible for 5 seconds', '50% visible for 1 second minimum', 'Any partial view counts', 'Clicked to count'], correct: '50% visible for 1 second minimum' },
    ],
  },
  'search-quality': {
    title: 'Search Quality Survey',
    reward: 2.60,
    questions: [
      { q: 'Search query "apple" - how should results be ranked?', options: ['Only Apple Inc.', 'Only fruit', 'Mixed based on user context and popularity', 'Alphabetical'], correct: 'Mixed based on user context and popularity' },
      { q: 'NDCG (Normalized Discounted Cumulative Gain) measures:', options: ['Search speed', 'Ranking quality with position-weighted relevance', 'Number of results', 'Query complexity'], correct: 'Ranking quality with position-weighted relevance' },
      { q: 'User searches "how to fix a leaky faucet" and clicks result 7. This signals:', options: ['Results 1-6 were irrelevant', 'Result 7 had a better title', 'Possible ranking issue for top results', 'Normal behavior'], correct: 'Possible ranking issue for top results' },
      { q: '"Zero-result searches" should be handled by:', options: ['Showing error page', 'Suggesting alternative queries and related results', 'Showing ads only', 'Doing nothing'], correct: 'Suggesting alternative queries and related results' },
      { q: 'Search result freshness matters most for:', options: ['Historical facts', 'Breaking news queries', 'Product specifications', 'How-to guides'], correct: 'Breaking news queries' },
      { q: 'Featured snippet (position zero) should be:', options: ['Longest answer available', 'Direct, concise answer from authoritative source', 'Paid placement', 'Random selection'], correct: 'Direct, concise answer from authoritative source' },
      { q: 'Query "jaguar speed" is ambiguous because:', options: ['It\'s too short', 'Could mean animal or car', 'Speed is relative', 'No ambiguity exists'], correct: 'Could mean animal or car' },
      { q: 'Precision vs Recall tradeoff: high precision means:', options: ['Many results, some irrelevant', 'Fewer results, mostly relevant', 'Fast response time', 'Comprehensive coverage'], correct: 'Fewer results, mostly relevant' },
      { q: 'Personalized search results raise concerns about:', options: ['Speed', 'Filter bubbles limiting information diversity', 'Storage costs', 'Technical complexity'], correct: 'Filter bubbles limiting information diversity' },
      { q: 'Query intent for "pizza near me" is:', options: ['Informational', 'Navigational', 'Transactional/local', 'Educational'], correct: 'Transactional/local' },
    ],
  },
  'video-tag': {
    title: 'Video Tagging Survey',
    reward: 2.50,
    questions: [
      { q: 'A 10-minute cooking video should have how many tags?', options: ['1-3', '5-15 covering ingredients, cuisine, technique', '50+', 'No tags needed'], correct: '5-15 covering ingredients, cuisine, technique' },
      { q: 'Temporal tagging (timestamps) in videos helps with:', options: ['SEO only', 'User navigation to specific sections', 'Storage optimization', 'Copyright claims'], correct: 'User navigation to specific sections' },
      { q: 'A music video with violent imagery should be tagged:', options: ['Music only', 'Music + explicit content warning', 'Violence only', 'Untaggable'], correct: 'Music + explicit content warning' },
      { q: 'Auto-generated tags from speech-to-text should be:', options: ['Used directly without review', 'Reviewed and curated by humans', 'Discarded - unreliable', 'Only used for internal search'], correct: 'Reviewed and curated by humans' },
      { q: 'Video showing multiple sports (soccer and basketball). Tagging approach:', options: ['Tag dominant sport only', 'Tag both sports with timestamps', 'Create separate listings', 'Use generic "sports" tag'], correct: 'Tag both sports with timestamps' },
      { q: 'Thumbnail selection for video tagging should prioritize:', options: ['First frame', 'Most visually engaging and representative frame', 'Random frame', 'Last frame'], correct: 'Most visually engaging and representative frame' },
      { q: 'Clickbait tags that don\'t match content cause:', options: ['Higher views', 'Increased bounce rate and user distrust', 'Better SEO', 'No impact'], correct: 'Increased bounce rate and user distrust' },
      { q: 'NSFW detection in video requires analyzing:', options: ['Thumbnails only', 'Multiple frames throughout the video', 'Audio only', 'Title and description only'], correct: 'Multiple frames throughout the video' },
      { q: 'Hierarchical tagging example: "Dog > Golden Retriever > Puppy" represents:', options: ['Three separate tags', 'Increasing specificity taxonomy', 'Contradictory tags', 'Redundant tagging'], correct: 'Increasing specificity taxonomy' },
      { q: 'Live stream VODs should be tagged differently because:', options: ['They\'re lower quality', 'Content is unstructured and may need chapter markers', 'They\'re shorter', 'No difference'], correct: 'Content is unstructured and may need chapter markers' },
    ],
  },
  'resume-screen': {
    title: 'Resume Screening Survey',
    reward: 2.95,
    questions: [
      { q: 'Resume lists "10 years Python experience" for a 2023 grad. Red flag because:', options: ['Python is outdated', 'Timeline doesn\'t match - likely exaggerated', 'Too much experience', 'No issue'], correct: 'Timeline doesn\'t match - likely exaggerated' },
      { q: 'ATS (Applicant Tracking System) primarily filters by:', options: ['Resume design', 'Keyword matching against job requirements', 'Photo quality', 'File size'], correct: 'Keyword matching against job requirements' },
      { q: 'Bias-free screening should ignore:', options: ['Skills and experience', 'Name, age, gender, and photo', 'Education credentials', 'Work history'], correct: 'Name, age, gender, and photo' },
      { q: 'A career gap of 2 years should be:', options: ['Automatic rejection', 'Noted and explored in interview if otherwise qualified', 'Ignored completely', 'Major red flag'], correct: 'Noted and explored in interview if otherwise qualified' },
      { q: '"Responsible for team of 50" vs "Led team of 50 achieving 30% revenue growth." Better is:', options: ['First - clearer', 'Second - shows impact with metrics', 'Both equal', 'Neither is good'], correct: 'Second - shows impact with metrics' },
      { q: 'Over-qualified candidate for entry-level role. Concern:', options: ['Will demand high salary', 'May leave when better opportunity arises', 'Will outperform peers', 'No concern'], correct: 'May leave when better opportunity arises' },
      { q: 'Resume with 15 different short-term jobs in 5 years indicates:', options: ['Versatile experience', 'Potential job-hopping pattern', 'Industry norm in gig economy', 'Excellent adaptability'], correct: 'Potential job-hopping pattern' },
      { q: 'Skills-based resume format is best for:', options: ['Senior executives', 'Career changers or those with gaps', 'Fresh graduates', 'Everyone'], correct: 'Career changers or those with gaps' },
      { q: 'Reference check reveals candidate was "eligible for rehire." This means:', options: ['Outstanding performance', 'Left on acceptable terms', 'Was terminated', 'Never actually worked there'], correct: 'Left on acceptable terms' },
      { q: 'Cultural fit assessment should NOT consider:', options: ['Communication style alignment', 'Values alignment with company', 'Protected characteristics (race, religion, etc.)', 'Work style preferences'], correct: 'Protected characteristics (race, religion, etc.)' },
    ],
  },
  'legal-review': {
    title: 'Legal Review Survey',
    reward: 3.30,
    questions: [
      { q: 'A contract clause states "best efforts" vs "reasonable efforts." The higher obligation is:', options: ['Reasonable efforts', 'Best efforts', 'Both are identical', 'Neither creates obligation'], correct: 'Best efforts' },
      { q: 'An NDA with "perpetual" confidentiality duration is:', options: ['Standard practice', 'Potentially unenforceable in many jurisdictions', 'Preferred by all parties', 'Required by law'], correct: 'Potentially unenforceable in many jurisdictions' },
      { q: 'Force majeure clause that doesn\'t include "pandemic" post-2020:', options: ['Normal omission', 'Significant gap that should be flagged', 'Not legally relevant', 'Automatically implied'], correct: 'Significant gap that should be flagged' },
      { q: '"Indemnification" in a contract means:', options: ['Payment for services', 'One party compensates the other for losses', 'Contract termination', 'Warranty extension'], correct: 'One party compensates the other for losses' },
      { q: 'A non-compete clause with 5-year duration and global scope is:', options: ['Standard', 'Likely overbroad and potentially unenforceable', 'Perfectly reasonable', 'Illegal everywhere'], correct: 'Likely overbroad and potentially unenforceable' },
      { q: '"Governing law" clause designating Delaware for a California company operating in New York:', options: ['Unusual but legal', 'Common practice - Delaware is business-friendly', 'Illegal', 'Meaningless'], correct: 'Common practice - Delaware is business-friendly' },
      { q: 'Assignment clause: "This agreement may not be assigned without written consent." Implication:', options: ['Either party can assign freely', 'Transfer requires the other party\'s permission', 'Only the first party can assign', 'Assignment is impossible'], correct: 'Transfer requires the other party\'s permission' },
      { q: 'Limitation of liability capped at "fees paid in the last 12 months." This protects:', options: ['The customer', 'The service provider from unlimited damages', 'Both equally', 'Neither party'], correct: 'The service provider from unlimited damages' },
      { q: '"Time is of the essence" in a contract means:', options: ['Casual reminder', 'Deadlines are strictly enforceable and delays are material breaches', 'Aspirational timeline', 'Work should be done quickly'], correct: 'Deadlines are strictly enforceable and delays are material breaches' },
      { q: 'Severability clause ensures that if one provision is invalid:', options: ['Entire contract is void', 'Remaining provisions stay in effect', 'Contract must be renegotiated', 'Court decides everything'], correct: 'Remaining provisions stay in effect' },
    ],
  },
  'map-valid': {
    title: 'Map Validation Survey',
    reward: 2.00,
    questions: [
      { q: 'A POI (Point of Interest) is marked 500m from its actual location. Acceptable tolerance?', options: ['Yes - close enough', 'No - should be within 50m for urban areas', 'Depends on zoom level', 'Only matters for navigation'], correct: 'No - should be within 50m for urban areas' },
      { q: 'Road segment marked as "highway" but satellite shows a dirt path. Action:', options: ['Keep as highway', 'Reclassify based on satellite evidence', 'Delete the road', 'Mark as under construction'], correct: 'Reclassify based on satellite evidence' },
      { q: 'Building footprint doesn\'t align with satellite imagery by 10m. Likely cause:', options: ['GPS drift or imagery offset', 'Building was demolished', 'Intentional obfuscation', 'Map is outdated'], correct: 'GPS drift or imagery offset' },
      { q: 'Speed limit data from 2018 for a road. Should it be:', options: ['Accepted as current', 'Flagged as potentially outdated', 'Deleted', 'Automatically updated'], correct: 'Flagged as potentially outdated' },
      { q: 'A one-way street marked as two-way in the map. Severity:', options: ['Low - cosmetic issue', 'High - navigation safety concern', 'Medium - inconvenience', 'No impact'], correct: 'High - navigation safety concern' },
      { q: 'Duplicate entries for same business at same location:', options: ['Keep both for completeness', 'Merge into one authoritative entry', 'Delete both and start fresh', 'Keep the newer one'], correct: 'Merge into one authoritative entry' },
      { q: 'Map shows a bridge where satellite shows water only. This could mean:', options: ['Bridge was demolished', 'Bridge exists but not visible in imagery', 'Map error', 'Any of these - requires ground truth verification'], correct: 'Any of these - requires ground truth verification' },
      { q: 'Address format validation: "123 Main St" vs "123 Main Street." Best practice:', options: ['Reject non-standard formats', 'Normalize to consistent format', 'Accept both as valid', 'Flag for human review'], correct: 'Normalize to consistent format' },
      { q: 'Time zone boundary on map is off by 5km. Impact:', options: ['Negligible', 'Significant for scheduling and logistics', 'Only affects clocks', 'No real-world impact'], correct: 'Significant for scheduling and logistics' },
      { q: 'Crowdsourced map edit changes major highway routing. Verification needed?', options: ['No - trust the crowd', 'Yes - high-impact edits need review', 'Only if reported', 'Auto-approve after 24 hours'], correct: 'Yes - high-impact edits need review' },
    ],
  },
  'weather-data': {
    title: 'Weather Data Survey',
    reward: 1.85,
    questions: [
      { q: 'Temperature reading of 55°C in London in July. This is likely:', options: ['Accurate', 'Sensor malfunction - flag as erroneous', 'Climate change', 'Normal heat wave'], correct: 'Sensor malfunction - flag as erroneous' },
      { q: 'Wind speed reported as 150 km/h during clear skies. Assessment:', options: ['Possible microburst', 'Likely measurement error', 'Normal wind pattern', 'Hurricane approaching'], correct: 'Likely measurement error' },
      { q: 'Weather station reports 0mm rainfall but nearby stations report 50mm. Action:', options: ['Average all stations', 'Flag the 0mm station for equipment check', 'Ignore outlier', 'Report 0mm'], correct: 'Flag the 0mm station for equipment check' },
      { q: 'Historical temperature data has a gap from 1942-1945. Most likely reason:', options: ['Equipment failure', 'War-related disruption of observations', 'Data corruption', 'No weather events occurred'], correct: 'War-related disruption of observations' },
      { q: 'Dew point exceeding air temperature in a dataset indicates:', options: ['Very humid conditions', 'Data error - physically impossible', 'Fog formation', 'Temperature inversion'], correct: 'Data error - physically impossible' },
      { q: 'UV Index of 15 in Nairobi at noon. Classification:', options: ['Low', 'Moderate', 'Extreme - seek shade', 'Impossible reading'], correct: 'Extreme - seek shade' },
      { q: 'Barometric pressure dropping rapidly (10 hPa in 3 hours) indicates:', options: ['Fair weather', 'Approaching severe storm', 'Equipment calibration needed', 'Normal fluctuation'], correct: 'Approaching severe storm' },
      { q: 'Satellite cloud classification: cumulonimbus clouds indicate:', options: ['Fair weather', 'Potential thunderstorms and severe weather', 'Ground fog', 'Clear skies ahead'], correct: 'Potential thunderstorms and severe weather' },
      { q: 'Climate data homogenization is needed to:', options: ['Make data prettier', 'Correct for station moves, instrument changes, and urban heat effects', 'Delete outliers', 'Fill in missing data'], correct: 'Correct for station moves, instrument changes, and urban heat effects' },
      { q: 'Automated weather station vs manual observation. Key advantage of automated:', options: ['More accurate', 'Consistent temporal resolution (continuous data)', 'Cheaper to install', 'Better at cloud identification'], correct: 'Consistent temporal resolution (continuous data)' },
    ],
  },
  'social-analysis': {
    title: 'Social Media Analysis Survey',
    reward: 2.65,
    questions: [
      { q: 'Post goes viral with 10K shares in 1 hour. First analysis step:', options: ['Celebrate', 'Check for bot amplification patterns', 'Count impressions', 'Reply to comments'], correct: 'Check for bot amplification patterns' },
      { q: 'Engagement rate = (likes + comments + shares) / followers. Rate of 15% is:', options: ['Below average', 'Average', 'Exceptionally high - verify authenticity', 'Normal for large accounts'], correct: 'Exceptionally high - verify authenticity' },
      { q: 'Hashtag analysis shows #brand trending but sentiment is 80% negative. This is:', options: ['Good - brand awareness', 'Crisis situation requiring immediate response', 'Normal fluctuation', 'Ignore - all publicity is good'], correct: 'Crisis situation requiring immediate response' },
      { q: 'Account created yesterday with 50K followers. Likely:', options: ['Celebrity account', 'Purchased/fake followers', 'Viral content creator', 'Corporate account'], correct: 'Purchased/fake followers' },
      { q: 'Best time to post analysis should consider:', options: ['Only time zones', 'Audience activity patterns, time zones, and content type', 'Only weekdays vs weekends', 'Post whenever convenient'], correct: 'Audience activity patterns, time zones, and content type' },
      { q: 'Social listening for "our product sucks" should be classified as:', options: ['Ignore - informal language', 'Negative brand mention requiring attention', 'Spam', 'Competitor attack'], correct: 'Negative brand mention requiring attention' },
      { q: 'Influencer with 1M followers but only 100 likes per post. Metric suggests:', options: ['Low-quality content', 'Fake or inactive follower base', 'Algorithm suppression', 'New account'], correct: 'Fake or inactive follower base' },
      { q: 'Cross-platform analysis: same message performs differently on Twitter vs Instagram because:', options: ['Random chance', 'Different audience demographics and content format expectations', 'Platform bias', 'Time of posting'], correct: 'Different audience demographics and content format expectations' },
      { q: 'Social media ROI should ultimately be measured by:', options: ['Follower count', 'Business outcomes (conversions, revenue, leads)', 'Like count', 'Impression count'], correct: 'Business outcomes (conversions, revenue, leads)' },
      { q: 'Coordinated inauthentic behavior (CIB) detection looks for:', options: ['High posting frequency', 'Synchronized actions across multiple accounts', 'Use of hashtags', 'Professional content quality'], correct: 'Synchronized actions across multiple accounts' },
    ],
  },
  'support-qa': {
    title: 'Customer Support QA Survey',
    reward: 2.30,
    questions: [
      { q: 'Support agent says "That\'s not my department." Correct response should be:', options: ['Transfer without context', '"Let me connect you with the right team and brief them on your issue"', '"You\'ll need to call back"', '"I can\'t help with that"'], correct: '"Let me connect you with the right team and brief them on your issue"' },
      { q: 'CSAT score of 3/5 from a resolved ticket indicates:', options: ['Great performance', 'Resolution achieved but experience was mediocre', 'Total failure', 'Cannot determine'], correct: 'Resolution achieved but experience was mediocre' },
      { q: 'First Contact Resolution (FCR) rate of 45% means:', options: ['Excellent performance', 'Below industry standard - over half need follow-up', 'Average', 'Perfect for complex products'], correct: 'Below industry standard - over half need follow-up' },
      { q: 'Customer says "I\'ve explained this 3 times already." QA issue:', options: ['Customer is difficult', 'Poor case documentation and handoff between agents', 'Normal for complex issues', 'Agent did nothing wrong'], correct: 'Poor case documentation and handoff between agents' },
      { q: 'Average Handle Time (AHT) is too high. Solution:', options: ['Rush customers', 'Improve knowledge base and agent training', 'Set time limits', 'Auto-close tickets'], correct: 'Improve knowledge base and agent training' },
      { q: 'Agent provides technically correct but cold response. QA score should:', options: ['Be perfect - answer was correct', 'Deduct for lack of empathy and tone', 'Ignore tone', 'Give bonus points'], correct: 'Deduct for lack of empathy and tone' },
      { q: 'Escalation rate of 40% for Tier 1 support indicates:', options: ['Good filtering', 'Insufficient Tier 1 training or empowerment', 'Complex product', 'Proper process'], correct: 'Insufficient Tier 1 training or empowerment' },
      { q: 'Customer threatens legal action in chat. Agent should:', options: ['Argue back', 'Stay calm, document, and escalate to supervisor', 'End the chat', 'Offer free product'], correct: 'Stay calm, document, and escalate to supervisor' },
      { q: 'Canned/template response used without personalization. QA finding:', options: ['Efficient', 'Impersonal - should customize for context', 'Best practice', 'Saves time'], correct: 'Impersonal - should customize for context' },
      { q: 'Quality calibration sessions between QA reviewers ensure:', options: ['Faster reviews', 'Consistent scoring standards across evaluators', 'Lower scores', 'Agent punishment'], correct: 'Consistent scoring standards across evaluators' },
    ],
  },
  'accessibility': {
    title: 'Accessibility Audit Survey',
    reward: 2.85,
    questions: [
      { q: 'Image without alt text violates which WCAG guideline?', options: ['1.1.1 Non-text Content', '2.1.1 Keyboard', '3.1.1 Language', '4.1.1 Parsing'], correct: '1.1.1 Non-text Content' },
      { q: 'Color contrast ratio of 3:1 for normal text. WCAG AA compliance:', options: ['Passes', 'Fails - needs 4.5:1 minimum', 'Only fails for large text', 'Not measurable'], correct: 'Fails - needs 4.5:1 minimum' },
      { q: 'A website only navigable by mouse. This excludes:', options: ['Mobile users', 'Keyboard-only users and screen reader users', 'Users with slow internet', 'No one'], correct: 'Keyboard-only users and screen reader users' },
      { q: 'ARIA role="button" on a <div>. What\'s still missing?', options: ['Nothing', 'Keyboard event handlers (Enter/Space) and tabindex', 'Just styling', 'A label'], correct: 'Keyboard event handlers (Enter/Space) and tabindex' },
      { q: 'Auto-playing video with sound violates:', options: ['No guideline', 'WCAG 1.4.2 Audio Control', 'WCAG 2.2.2 Pause', 'Both 1.4.2 and 2.2.2'], correct: 'Both 1.4.2 and 2.2.2' },
      { q: 'Form field without associated label. Screen reader will:', options: ['Read the placeholder', 'Not identify the field\'s purpose', 'Skip the field', 'Read nearby text'], correct: 'Not identify the field\'s purpose' },
      { q: 'Skip navigation link helps users who:', options: ['Have slow connections', 'Navigate with keyboard by bypassing repetitive content', 'Use large screens', 'Prefer minimal UI'], correct: 'Navigate with keyboard by bypassing repetitive content' },
      { q: 'Focus indicator removed with CSS `outline: none` without alternative:', options: ['Improves aesthetics', 'Creates keyboard navigation barrier', 'Best practice', 'Only affects IE'], correct: 'Creates keyboard navigation barrier' },
      { q: 'Content that flashes more than 3 times per second risks:', options: ['Eye strain', 'Triggering seizures in photosensitive users', 'Slow page load', 'Battery drain'], correct: 'Triggering seizures in photosensitive users' },
      { q: 'WCAG Level AAA requires text contrast ratio of:', options: ['3:1', '4.5:1', '7:1', '10:1'], correct: '7:1' },
    ],
  },
  'uiux-review': {
    title: 'UI/UX Review Survey',
    reward: 2.75,
    questions: [
      { q: 'Fitts\'s Law states that button click time depends on:', options: ['Color only', 'Distance to target and target size', 'Number of buttons', 'Screen resolution'], correct: 'Distance to target and target size' },
      { q: 'A form with 15 required fields on one page. UX recommendation:', options: ['Add more fields', 'Break into multi-step wizard with progress indicator', 'Make all optional', 'Remove the form'], correct: 'Break into multi-step wizard with progress indicator' },
      { q: 'Jakob\'s Law suggests users prefer:', options: ['Unique designs', 'Sites that work like others they already know', 'Minimalist designs', 'Animated interfaces'], correct: 'Sites that work like others they already know' },
      { q: 'Modal dialog that can\'t be closed. UX issue:', options: ['Keeps user focused', 'Violates user control and freedom heuristic', 'Good for important messages', 'Standard pattern'], correct: 'Violates user control and freedom heuristic' },
      { q: 'Infinite scroll vs pagination. Infinite scroll is better for:', options: ['Data tables', 'Casual content browsing (social feeds)', 'E-commerce product listings', 'Search results'], correct: 'Casual content browsing (social feeds)' },
      { q: 'Error message "Error 500" is bad UX because:', options: ['Too short', 'Technical jargon with no actionable guidance', 'Wrong color', 'Too specific'], correct: 'Technical jargon with no actionable guidance' },
      { q: 'Dark pattern: "Are you sure you don\'t want to not unsubscribe?" This violates:', options: ['Accessibility', 'Clarity and honest communication', 'Performance', 'Branding'], correct: 'Clarity and honest communication' },
      { q: 'Mobile touch target minimum size (Material Design):', options: ['24x24dp', '48x48dp', '16x16dp', '64x64dp'], correct: '48x48dp' },
      { q: 'Cognitive load in UI design means:', options: ['Page weight in KB', 'Mental effort required to use the interface', 'Number of colors used', 'Loading time'], correct: 'Mental effort required to use the interface' },
      { q: 'Hick\'s Law: increasing choices from 5 to 50 will:', options: ['Help users find what they want', 'Increase decision time and decrease satisfaction', 'Have no effect', 'Improve conversion'], correct: 'Increase decision time and decrease satisfaction' },
    ],
  },
  'math-verify': {
    title: 'Math Verification Survey',
    reward: 3.05,
    questions: [
      { q: 'Verify: 17 × 23 = 391', options: ['Correct', 'Incorrect - answer is 381', 'Incorrect - answer is 401', 'Incorrect - answer is 371'], correct: 'Correct' },
      { q: 'A student writes: √(a² + b²) = a + b. This is:', options: ['Correct', 'Incorrect - violates square root properties', 'Only true when a=0 or b=0', 'Approximately correct'], correct: 'Incorrect - violates square root properties' },
      { q: 'Compound interest: $1000 at 5% annually for 3 years ≈ $1157.63. Verify:', options: ['Correct', 'Incorrect - should be $1150.00', 'Incorrect - should be $1161.05', 'Incorrect - should be $1015.00'], correct: 'Incorrect - should be $1161.05' },
      { q: 'Probability of rolling two sixes with two dice: 1/36. Verify:', options: ['Correct', 'Incorrect - should be 1/12', 'Incorrect - should be 2/36', 'Incorrect - should be 1/6'], correct: 'Correct' },
      { q: 'Derivative of x³ = 3x. Is this correct?', options: ['Yes', 'No - should be 3x²', 'No - should be x²', 'No - should be 3x³'], correct: 'No - should be 3x²' },
      { q: 'If log₂(x) = 5, then x = 32. Verify:', options: ['Correct', 'Incorrect - x = 25', 'Incorrect - x = 10', 'Incorrect - x = 64'], correct: 'Correct' },
      { q: 'Triangle with sides 3, 4, 5. Is it a right triangle?', options: ['Yes - satisfies Pythagorean theorem', 'No - doesn\'t satisfy theorem', 'Only if angles are measured', 'Cannot determine'], correct: 'Yes - satisfies Pythagorean theorem' },
      { q: 'Mean of {2, 4, 6, 8, 10} = 6. Standard deviation ≈ 2.83. Verify:', options: ['Both correct', 'Mean correct, SD incorrect', 'Mean incorrect, SD correct', 'Both incorrect'], correct: 'Both correct' },
      { q: 'Limit as x→0 of (sin x)/x = 0. Verify:', options: ['Correct', 'Incorrect - limit is 1', 'Incorrect - limit is undefined', 'Incorrect - limit is infinity'], correct: 'Incorrect - limit is 1' },
      { q: '2⁰ = 0. Is this correct?', options: ['Yes', 'No - 2⁰ = 1', 'No - 2⁰ = 2', 'Undefined'], correct: 'No - 2⁰ = 1' },
    ],
  },
  'science-fact': {
    title: 'Science Fact Check Survey',
    reward: 3.15,
    questions: [
      { q: '"The Great Wall of China is visible from space with the naked eye." Verdict:', options: ['True', 'False - too narrow to see from orbit', 'Partially true', 'Depends on definition of space'], correct: 'False - too narrow to see from orbit' },
      { q: '"Lightning never strikes the same place twice." Scientific accuracy:', options: ['True', 'False - tall structures are struck repeatedly', 'True for open ground', 'Unverifiable'], correct: 'False - tall structures are struck repeatedly' },
      { q: '"We have 5 senses." More accurately:', options: ['Exactly 5', 'Humans have far more including proprioception, thermoception, etc.', 'We have 3', 'We have 7'], correct: 'Humans have far more including proprioception, thermoception, etc.' },
      { q: '"Goldfish have a 3-second memory." Scientific evidence shows:', options: ['True', 'False - goldfish can remember for months', 'Partially true - 10 seconds', 'Cannot be tested'], correct: 'False - goldfish can remember for months' },
      { q: '"Evolution says humans descended from monkeys." More accurate statement:', options: ['Exactly correct', 'Humans and modern apes share a common ancestor', 'Humans evolved from chimpanzees', 'Evolution is unproven'], correct: 'Humans and modern apes share a common ancestor' },
      { q: '"Antibiotics kill viruses." This is:', options: ['True', 'False - antibiotics target bacteria, not viruses', 'True for some viruses', 'Depends on the antibiotic'], correct: 'False - antibiotics target bacteria, not viruses' },
      { q: '"The tongue has distinct taste zones." Current science says:', options: ['True - clearly mapped', 'Largely debunked - all areas detect all tastes', 'True but varies by person', 'Only for bitter and sweet'], correct: 'Largely debunked - all areas detect all tastes' },
      { q: '"Glass is a liquid that flows slowly over centuries." This is:', options: ['True', 'False - glass is an amorphous solid', 'Partially true', 'True for old glass only'], correct: 'False - glass is an amorphous solid' },
      { q: '"Seasons are caused by Earth\'s distance from the Sun." Correct explanation:', options: ['True', 'False - caused by Earth\'s axial tilt', 'Partially true', 'True for Southern hemisphere'], correct: 'False - caused by Earth\'s axial tilt' },
      { q: '"Humans share ~60% DNA with bananas." This claim is:', options: ['Absurd', 'Approximately true - due to shared fundamental biology', 'Exactly 50%', 'Only 1%'], correct: 'Approximately true - due to shared fundamental biology' },
    ],
  },
};

const Survey = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { completeSurvey, completedSurveys, accountType } = useUserStore();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [showPlans, setShowPlans] = useState(false);

  const survey = surveyQuestions[id || ''];
  if (!survey) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground text-xs">Survey not found</div>;

  // Free account gating: only 1 free survey (data-cat), and only if no surveys completed yet
  const needsUpgrade = accountType === 'free' && (completedSurveys.length > 0 || id !== 'data-cat');

  if (needsUpgrade) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="text-center w-full max-w-md">
          <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-lg font-bold text-foreground mb-2">Paid Account Required</h1>
          <p className="text-muted-foreground text-xs mb-5">Upgrade your account to access this survey and unlock all earning opportunities.</p>
          <button onClick={() => setShowPlans(true)} className="w-full gradient-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold text-sm glow-primary">
            Upgrade Now
          </button>
          <button onClick={() => navigate('/dashboard')} className="text-muted-foreground text-xs mt-3 block mx-auto">
            ← Back to Dashboard
          </button>
          {showPlans && <PlansModal onClose={() => setShowPlans(false)} />}
        </div>
      </div>
    );
  }

  if (completedSurveys.includes(id || '')) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <p className="text-2xl mb-3">✅</p>
          <h1 className="text-lg font-bold text-foreground">Already Completed</h1>
          <p className="text-muted-foreground text-xs mt-1">You've already completed this survey.</p>
          <button onClick={() => navigate('/dashboard')} className="gradient-primary text-primary-foreground px-8 py-2.5 rounded-xl mt-5 font-semibold text-xs">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const q = survey.questions[current];

  const handleAnswer = (opt: string) => {
    const newAnswers = [...answers, opt];
    setAnswers(newAnswers);
    if (current < survey.questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setDone(true);
      completeSurvey(id || '', survey.reward);
    }
  };

  if (done) {
    const correct = answers.filter((a, i) => a === survey.questions[i].correct).length;
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <p className="text-4xl mb-3">🎉</p>
          <h1 className="text-xl font-bold text-foreground">Survey Complete!</h1>
          <p className="text-muted-foreground text-xs mt-1">You scored {correct}/{survey.questions.length}</p>
          <div className="bg-card rounded-xl p-5 border border-success/30 mt-4">
            <p className="text-muted-foreground text-xs">Earned</p>
            <p className="text-3xl font-black text-success">${survey.reward.toFixed(2)}</p>
            <p className="text-muted-foreground text-[10px] mt-1">Added to your balance</p>
          </div>
          <button onClick={() => navigate('/dashboard')} className="w-full gradient-success text-success-foreground font-semibold py-3.5 rounded-xl mt-5 text-sm">
            Back to Dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-4 py-5">
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-base font-bold text-foreground">{survey.title}</h1>
          <span className="text-success font-bold text-xs">${survey.reward.toFixed(2)}</span>
        </div>

        <div className="w-full bg-secondary rounded-full h-1.5 mb-5">
          <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${((current + 1) / survey.questions.length) * 100}%` }} />
        </div>

        <p className="text-muted-foreground text-[10px] mb-2">Question {current + 1} of {survey.questions.length}</p>

        <div className="bg-card rounded-xl p-4 border border-border mb-4">
          <p className="text-foreground text-xs leading-relaxed">{q.q}</p>
        </div>

        <div className="space-y-2">
          {q.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              className="w-full text-left bg-card border border-border rounded-xl p-3 text-foreground text-xs hover:border-primary/50 transition-all"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Survey;
