import { Router } from "express";
import {createQuestion, getQuestionbyIdQuizz, getAllQuestionsbyidCourse} from "../controllers/questionController"

const router = Router();

// tạo một câu hỏi mới

router.post('/create', createQuestion);

// lấy tất các câu hỏi theo id quizz
router.get('/questionbyquizz/:idquizz', getQuestionbyIdQuizz);

// lấy tất cả các câu hỏi theo id khóa học
router.get('/questionbycourse/:idcourse', getAllQuestionsbyidCourse);

export default router;