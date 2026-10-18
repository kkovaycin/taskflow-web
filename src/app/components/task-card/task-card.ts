import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import type { ITask, TaskPriority, TaskStatus } from '../../interfaces/task.interface';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCard {
  readonly task = input.required<ITask>();
  readonly disabled = input(false);
  readonly deleting = input(false);

  readonly editRequested = output<ITask>();
  readonly deleteRequested = output<string>();

  protected readonly confirmingDelete = signal(false);

  protected readonly statusLabels: Record<TaskStatus, string> = {
    pending: 'Pending',
    in_progress: 'In progress',
    completed: 'Completed',
  };

  protected readonly priorityLabels: Record<TaskPriority, string> = {
    low: 'Low priority',
    medium: 'Medium priority',
    high: 'High priority',
  };
}
