<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddOptionalFieldsToStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('students', function (Blueprint $table) {
            // optional fields expected by the API and front-end
            if (!Schema::hasColumn('students', 'middle_name')) {
                $table->string('middle_name')->nullable()->after('first_name');
            }
            if (!Schema::hasColumn('students', 'extension_name')) {
                $table->string('extension_name')->nullable()->after('last_name');
            }
            if (!Schema::hasColumn('students', 'archived')) {
                $table->boolean('archived')->default(false)->after('status');
            }
            if (!Schema::hasColumn('students', 'course_id')) {
                $table->foreignId('course_id')->nullable()->constrained('courses')->onDelete('set null')->after('department_id');
            }
            if (!Schema::hasColumn('students', 'academic_year_id')) {
                $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->onDelete('set null')->after('course_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('students', function (Blueprint $table) {
            if (Schema::hasColumn('students', 'academic_year_id')) {
                $table->dropConstrainedForeignId('academic_year_id');
            }
            if (Schema::hasColumn('students', 'course_id')) {
                $table->dropConstrainedForeignId('course_id');
            }
            if (Schema::hasColumn('students', 'archived')) {
                $table->dropColumn('archived');
            }
            if (Schema::hasColumn('students', 'extension_name')) {
                $table->dropColumn('extension_name');
            }
            if (Schema::hasColumn('students', 'middle_name')) {
                $table->dropColumn('middle_name');
            }
        });
    }
}
