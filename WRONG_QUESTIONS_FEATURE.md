# Wrong Questions Tracking Feature

## Overview
This feature automatically tracks incorrect answers by question type/category and stores them in Firebase. Users can then review all questions they got wrong in each specific category.

## How It Works

### 1. When a Question is Answered Incorrectly

When a user submits a wrong answer in `script.js`, the following happens:

```javascript
// In submitBtn event listener (script.js ~line 620)
const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

await updateUserProgress(
    currentQuestion.id,       // Question ID
    isCorrect,                // false when wrong
    currentQuestion.skillCategory,
    currentQuestion.tags || [],
    currentQuestion           // Full question object
);
```

### 2. Question Categorization

The `updateUserProgress()` function automatically categorizes questions based on their tags:

**Tag to Category Mapping:**
- `algebra`, `linear equations`, `quadratic` → **Algebra**
- `advanced math`, `functions` → **Advanced Math**
- `geometry`, `trigonometry` → **Geometry & Trigonometry**
- `data analysis`, `statistics`, `probability`, `ratios` → **Problem Solving & Data Analysis**

### 3. Firebase Storage Structure

```
users/
  {userId}/
    progress/
      data/
        wrongQuestions: ["SAT_MATH_001", "SAT_MATH_005", ...]  // All wrong questions
        
        wrongQuestionsByCategory: {
          "Algebra": ["SAT_MATH_001", "SAT_MATH_002"],
          "Advanced_Math": ["SAT_MATH_004"],
          "Problem_Solving_&_Data_Analysis": ["SAT_MATH_005"],
          "Geometry_&_Trigonometry": [],
          "Craft_and_Structure": [],
          "Information_and_Ideas": [],
          "Standard_English_Conventions": [],
          "Expression_of_Ideas": []
        }
        
        skillScores: {
          "Algebra": { correct: 3, total: 5 },
          "Advanced_Math": { correct: 2, total: 3 }
        }
```

### 4. Retrieving Wrong Questions by Category

When a user clicks on a skill category in `breakdown.html`, they navigate to `skill-questions.html`:

```javascript
// skill-questions.js
import { loadWrongQuestionsForCategory } from './script.js';

// Get wrong questions for "Algebra"
const questions = await loadWrongQuestionsForCategory("Algebra");
```

This function:
1. Fetches question IDs from `wrongQuestionsByCategory.Algebra`
2. Loads full question data from Firestore `questions` collection
3. Returns array of question objects with all details

### 5. Displaying Wrong Questions

The `skill-questions.html` page displays:
- Question text
- All answer options (correct one highlighted in green, user's wrong answer in red)
- Explanation
- User's selected answer vs. correct answer

## Key Files Modified

### `script.js`
- **`updateUserProgress()`**: Enhanced to categorize and store wrong questions by category
- **`getWrongQuestionsByCategory()`**: Retrieves wrong question IDs for a specific category
- **`loadWrongQuestionsForCategory()`**: Loads full question data from Firestore
- **Initialization**: Sets up `wrongQuestionsByCategory` structure for new users

### `skill-questions.js`
- **Added Firebase imports**: `auth`, `db`, `onAuthStateChanged`, `loadWrongQuestionsForCategory`
- **`loadAndRenderWrongQuestions()`**: Loads questions from Firebase instead of mock data
- **Falls back to mock data** if user is not logged in

### `skill-questions.html`
- Changed script tag to `<script type="module">` to support ES6 imports

## Category Names

**SAT Math Categories:**
- Algebra
- Advanced Math
- Problem Solving & Data Analysis
- Geometry & Trigonometry

**SAT Reading & Writing Categories:**
- Craft and Structure
- Information and Ideas
- Standard English Conventions
- Expression of Ideas

**Note:** Category names with spaces are stored with underscores in Firebase (e.g., `Advanced_Math`, `Problem_Solving_&_Data_Analysis`)

## Testing the Feature

1. **Answer questions incorrectly** in the practice section
2. **Check Firebase Console**: 
   - Navigate to `users/{userId}/progress/data`
   - Verify `wrongQuestionsByCategory` has the question IDs
3. **Go to Progress/Breakdown page**
4. **Click on a skill category** (e.g., "Algebra")
5. **Verify wrong questions appear** on `skill-questions.html`

## Limitations

- Firestore `in` queries are limited to 10 items, so only first 10 wrong questions per category are loaded
- Questions must exist in Firestore `questions` collection to be retrieved
- Category mapping is hardcoded (can be made more flexible with a config file)

## Future Enhancements

- Support for more than 10 questions per category (batch queries)
- Allow users to mark questions as "mastered" to remove from wrong list
- Track retry attempts and success rate per question
- Add filters (difficulty, recently answered, etc.)
