<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class RegisterAdminTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function can_create_initial_admin()
    {
        $payload = [
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/register-admin', $payload);

        $response->assertStatus(201);
        $response->assertJsonStructure(['message', 'token', 'user' => ['id','name','email']]);
        $this->assertDatabaseHas('users', ['email' => 'admin@example.com', 'role' => 'admin']);
    }

    /** @test */
    public function cannot_create_second_admin()
    {
        User::factory()->create(['role' => 'admin', 'email' => 'existing@example.com']);

        $payload = [
            'name' => 'Another Admin',
            'email' => 'another@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/register-admin', $payload);

        $response->assertStatus(403);
        $response->assertJson(['message' => 'An admin account already exists.']);
    }
}
