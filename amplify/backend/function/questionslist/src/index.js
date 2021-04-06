const { parseQuestions, batchWriteQuestions } = require('./questions');

const MAX_ITEMS_PER_DB_WRITE = 25; // Maximum number of items DynamoDB allows per batch write

exports.handler = async (event) => {
  const questions = await parseQuestions();
  console.log(questions.length);
  // Write items to database in batches of size MAX_ITEMS_PER_DB_WRITE since DynamoDB restricts batch sizes
  for (let i = 0; i < questions.length / MAX_ITEMS_PER_DB_WRITE; i += 1) {
    const from = MAX_ITEMS_PER_DB_WRITE * i
    const to =  MAX_ITEMS_PER_DB_WRITE * (i + 1);
    console.log(from + ", " + to);
    const questionsBatch = questions.slice(from, to);
    await batchWriteQuestions(questionsBatch);
  }

  return { error: null };
};