import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  type OnChanges,
  type SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { ICreateTask, ITask, TaskPriority, TaskStatus } from '../../interfaces/task.interface';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskForm implements OnChanges {
  private readonly formBuilder = inject(FormBuilder);

  readonly task = input<ITask | null>(null);
  readonly submitting = input(false);
  readonly errorMessage = input('');

  readonly taskSubmitted = output<ICreateTask>();
  readonly cancelled = output<void>();

  protected readonly form = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    assignee: ['', Validators.required],
    status: this.formBuilder.nonNullable.control<TaskStatus>('pending'),
    priority: this.formBuilder.nonNullable.control<TaskPriority>('medium'),
  });

  ngOnChanges(changes: SimpleChanges): void {
    // Preserve the draft when only saving or error inputs change.
    if (!changes['task']) return;

    const task = this.task();

    this.form.reset({
      title: task?.title ?? '',
      description: task?.description ?? '',
      assignee: task?.assignee ?? '',
      status: task?.status ?? 'pending',
      priority: task?.priority ?? 'medium',
    });
  }

  protected submit(): void {
    if (this.submitting()) return;

    // Reject whitespace-only values before submitting the form.
    this.form.patchValue({
      title: this.form.controls.title.value.trim(),
      assignee: this.form.controls.assignee.value.trim(),
    });

    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.taskSubmitted.emit(this.form.getRawValue());
  }
}
