<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tasks;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class tasksController extends Controller
{
    // GET /api/tasks?status=pending,in_progress&sort=due_date&dir=asc&per_page=10
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $query = Tasks::query()->where('user_id', $userId);

        // Status filter
        if ($status = $request->query('status')) {
            $statuses = array_filter(explode(',', $status));
            $query->whereIn('status', $statuses);
        }

        // Order
        $sort = $request->query('sort', 'order');
        $dir = $request->query('dir', 'asc');
        if (!in_array($sort, ['order', 'due_date', 'created_at'], true))
            $sort = 'order';
        if (!in_array($dir, ['asc', 'desc'], true))
            $dir = 'asc';

        $query->orderBy($sort, $dir)->orderBy('created_at', 'desc');

        $perPage = (int) $request->query('per_page', 10);

        return response()->json(
            $query->paginate($perPage)
        );
    }

    // POST /api/tasks
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'order' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', Rule::in(['pending', 'in_progress', 'complete'])],
        ]);


        $data['status'] = $data['status'] ?? 'pending';

        $task = Tasks::create(array_merge($data, [
            'due_date' => $validated['due_date'] ?? now()->addDay(),
            'user_id' => $request->user()->id,
        ]));

        return response()->json($task, 201);
    }

    // GET /api/tasks/{uuid}
    public function show(Request $request, string $uuid)
    {
        $task = $this->findUserTaskByUuid($request->user()->id, $uuid);
        return response()->json($task);
    }

    // DELETE /api/tasks/{uuid}
    public function delete(Request $request, string $uuid)
    {
        $task = $this->findUserTaskByUuid($request->user()->id, $uuid);
        $task->delete();

        return response()->json(['message' => 'Task deleted'], 200);
    }

    // PUT /api/tasks/{uuid}
    public function update(Request $request, string $uuid)
    {
        $task = Tasks::where('uuid', $uuid)->where('user_id', $request->user()->id)->firstOrFail();

        $data = $request->only(['title', 'description', 'due_date', 'order', 'status']);

        if ($request->has('status') && $request->input('status') !== $task->status) {
          
            if (!$this->canTransition($task->status, $request->input('status'))) {
                return response()->json(['message' => 'Transition not allowed.'], 422); // o 409
            }
            $task->status = $request->input('status');
        }

        $task->fill(collect($data)->except('status')->toArray());
        $task->save();

        return response()->json($task);

    }

    // PATCH /api/tasks/{uuid}
    public function updatePartial(Request $request, string $uuid)
    {
        $task = $this->findUserTaskByUuid($request->user()->id, $uuid);

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'due_date' => ['sometimes', 'nullable', 'date'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'status' => ['sometimes', Rule::in(['pending', 'in_progress', 'complete'])],
        ]);

        if (array_key_exists('status', $data) && !$this->canTransition($task->status, $data['status'])) {
            return response()->json(['message' => 'Transition not allowed.'], 422);
        }

        $task->fill($data)->save();

        return response()->json([
            'task' => $task,
            'message' => 'Task updated successfully.',
        ]);
    }

    // ==== Helpers ====
    private function findUserTaskByUuid(int $userId, string $uuid): Tasks
    {
        return Tasks::where('uuid', $uuid)
            ->where('user_id', $userId)
            ->firstOrFail();
    }

    private function canTransition(string $from, string $to): bool
    {
        $allowed = [
            'pending' => ['in_progress', 'complete'],
            'in_progress' => ['complete'],
            'complete' => [],
        ];
        return in_array($to, $allowed[$from] ?? [], true);
    }
}
