<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('job_orders', function (Blueprint $table) {
            $table->id();
            $table->string('job_order_number')->unique();
            $table->string('company_name');
            $table->string('company_contact_person');
            $table->string('company_department');
            $table->string('company_contact_number');
            $table->string('company_address');
            $table->date('date_request');
            $table->date('date_start');
            $table->date('date_end');
            $table->string('status')->default('open');
            $table->string('priority')->default('low');
            $table->string('type')->default('maintenance');
            $table->string('description')->nullable();
            $table->json('notes')->nullable();
            $table->json('quotation')->nullable();
            $table->json('attachments')->nullable();
            $table->foreignId('engineer_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('engineer_supervisor_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('company_manager_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->timestamps();
            $table->string('engineer_signature')->nullable();
            $table->string('engineer_supervisor_signature')->nullable();
            $table->string('company_manager_signature')->nullable();
            $table->boolean('engineer_approved')->default(false);
            $table->boolean('engineer_supervisor_approved')->default(false);
            $table->boolean('company_manager_approved')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_orders');
    }
};
