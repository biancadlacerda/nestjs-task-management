import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus, { message: 'Invalid status. Allowed values are: OPEN, IN_PROGRESS, DONE' })
  status: TaskStatus;
}