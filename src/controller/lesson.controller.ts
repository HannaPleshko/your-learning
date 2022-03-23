import express, { Request, Response } from 'express';
import { ExceptionType } from '../exception/exception';
import { ErrorHandler, handleError } from '../helpers/error';
import { buildResponse } from '../helpers/response';
import { getLessons, getLesson, updateLesson, deleteLesson, createLesson } from '../service/lesson.service';

const router = express.Router();

router.post('/all-les', async (req: Request, res: Response) => {
  try {
    const { topic_id, course_id } = req.body;
    
    const lesson = await getLessons(topic_id, course_id);

    buildResponse(res, 200, lesson);
  } catch (err) {
    if (err instanceof ErrorHandler) handleError(err, res);
    else buildResponse(res, 500, ExceptionType.SERVER_ERROR);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lesson = await getLesson(id);

    buildResponse(res, 200, lesson);
  } catch (err) {
    if (err instanceof ErrorHandler) handleError(err, res);
    else buildResponse(res, 500, ExceptionType.SERVER_ERROR);
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { topic_id, is_read, title, content } = req.body;
    const lesson = await createLesson(topic_id, is_read, title, content);

    buildResponse(res, 200, lesson);
  } catch (err) {
    if (err instanceof ErrorHandler) handleError(err, res);
    else buildResponse(res, 500, ExceptionType.SERVER_ERROR);
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const lesson = await updateLesson();

    buildResponse(res, 200, lesson);
  } catch (err) {
    if (err instanceof ErrorHandler) handleError(err, res);
    else buildResponse(res, 500, ExceptionType.SERVER_ERROR);
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lesson = await deleteLesson(id);

    buildResponse(res, 200, lesson);
  } catch (err) {
    if (err instanceof ErrorHandler) handleError(err, res);
    else buildResponse(res, 500, ExceptionType.SERVER_ERROR);
  }
});

export { router };
