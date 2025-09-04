<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\tasksController;
use App\Http\Controllers\Api\AuthController;

use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;

RateLimiter::for('api', function (Request $request) {
    return [
        Limit::perMinute(60)->by(optional($request->user())->id ?: $request->ip()),
    ];
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // List all tasks
    Route::get('/tasks', [tasksController::class, 'index']);

    // Get a single task
    Route::get('/tasks/{uuid}', [tasksController::class, 'show']);

    // Create a new task
    Route::post('/tasks', [tasksController::class, 'store']);

    // Update an entire task
    Route::put('/tasks/{uuid}', [tasksController::class, 'update']);

    // Delete a task
    Route::delete('/tasks/{uuid}', [tasksController::class, 'delete']);

    //Partially updates the task
    Route::patch('/tasks/{uuid}', [tasksController::class, 'updatePartial']);

});