<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobOrder extends Model
{
    protected $guarded = [];

    protected $casts = [
        'notes' => 'array',
        'quotation' => 'array',
        'attachments' => 'array',
        'engineer_approved' => 'boolean',
        'engineer_supervisor_approved' => 'boolean',
        'company_manager_approved' => 'boolean',
        'date_request' => 'date',
        'date_start' => 'date',
        'date_end' => 'date',
    ];

    public function engineer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'engineer_id');
    }

    public function engineerSupervisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'engineer_supervisor_id');
    }

    public function companyManager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'company_manager_id');
    }
}
