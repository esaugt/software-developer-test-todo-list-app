<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Tasks extends Model
{
    use HasFactory;
    protected $table = 'tasks';

    protected $fillable = [
        'title',
        'description',
        'due_date',
        'order',
        'status',
        'user_id',
    ];
        protected $casts = [
        'due_date' => 'date',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->uuid = (string) Str::uuid();
        });
    }
       public function user()
    {
        return $this->belongsTo(User::class);
    }

}
