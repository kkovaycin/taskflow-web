import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  type OnInit,
} from '@angular/core';
import { finalize } from 'rxjs';
import { TaskCard } from '../../components/task-card/task-card';
import { TaskForm } from '../../components/task-form/task-form';
import type { ICreateTask, ITask } from '../../interfaces/task.interface';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-dashboard',
  imports: [TaskCard, TaskForm],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly taskService = inject(TaskService);

  protected readonly tasks = signal<ITask[]>([]);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly actionError = signal('');

  protected readonly formOpen = signal(false);
  protected readonly editingTask = signal<ITask | null>(null);
  protected readonly saving = signal(false);
  protected readonly formError = signal('');
  protected readonly deletingTaskId = signal<string | null>(null);

  protected readonly busy = computed(
    () => this.loading() || this.saving() || this.deletingTaskId() !== null,
  );

  ngOnInit(): void {
    this.loadTasks();
  }

  protected loadTasks(): void {
    if (this.busy() || this.formOpen()) return;

    this.loading.set(true);
    this.errorMessage.set('');
    this.actionError.set('');

    this.taskService
      .getAllTasks()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (tasks) => this.tasks.set(tasks),
        error: () => this.errorMessage.set('Could not load tasks. Please try again.'),
      });
  }

  protected openForm(task: ITask | null = null): void {
    if (this.busy() || this.formOpen()) return;

    this.editingTask.set(task);
    this.formError.set('');
    this.actionError.set('');
    this.formOpen.set(true);
  }

  protected cancelForm(): void {
    if (this.saving()) return;

    this.formOpen.set(false);
    this.editingTask.set(null);
    this.formError.set('');
  }

  protected saveTask(data: ICreateTask): void {
    if (this.busy() || !this.formOpen()) return;

    const editingTask = this.editingTask();

    const request = editingTask
      ? this.taskService.updateTask(editingTask.id, data)
      : this.taskService.createTask(data);

    this.saving.set(true);
    this.formError.set('');

    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (savedTask) => {
        // Use the server response so IDs and timestamps remain authoritative.
        this.tasks.update((tasks) =>
          editingTask
            ? tasks.map((task) => (task.id === savedTask.id ? savedTask : task))
            : [savedTask, ...tasks],
        );

        this.formOpen.set(false);
        this.editingTask.set(null);
        this.formError.set('');
        this.errorMessage.set('');
      },
      error: () =>
        this.formError.set(
          editingTask
            ? 'Could not update task. Please try again.'
            : 'Could not create task. Please try again.',
        ),
    });
  }

  protected deleteTask(id: string): void {
    if (this.busy() || this.formOpen()) return;

    this.deletingTaskId.set(id);
    this.actionError.set('');

    this.taskService
      .deleteTask(id)
      .pipe(finalize(() => this.deletingTaskId.set(null)))
      .subscribe({
        // Remove the card only after the API confirms deletion.
        next: () => this.tasks.update((tasks) => tasks.filter((task) => task.id !== id)),
        error: () => this.actionError.set('Could not delete task. Please try again.'),
      });
  }
}
