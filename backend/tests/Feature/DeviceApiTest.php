<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class DeviceApiTest extends TestCase
{
    use RefreshDatabase;

    private function getAuthToken(): string
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        return $user->createToken('test-token')->plainTextToken;
    }

    public function test_user_can_create_device(): void
    {
        $token = $this->getAuthToken();
        $user = User::where('email', 'test@example.com')->first();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/devices', [
                'name' => 'iPhone 14',
                'location' => 'Escritório',
                'purchase_date' => '2023-01-15',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'name' => 'iPhone 14',
                'location' => 'Escritório',
                'in_use' => false,
                'user_id' => $user->id,
            ]);

        $this->assertDatabaseHas('devices', [
            'name' => 'iPhone 14',
            'user_id' => $user->id,
        ]);
    }

    public function test_user_cannot_create_device_without_required_fields(): void
    {
        $token = $this->getAuthToken();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/devices', [
                'name' => '',
            ]);

        $response->assertStatus(422);
    }

    public function test_user_cannot_create_device_with_future_date(): void
    {
        $token = $this->getAuthToken();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/devices', [
                'name' => 'iPhone 14',
                'location' => 'Escritório',
                'purchase_date' => '2025-12-31',
            ]);

        $response->assertStatus(422);
    }

    public function test_user_can_list_devices(): void
    {
        $token = $this->getAuthToken();
        $user = User::where('email', 'test@example.com')->first();

        DB::table('devices')->insert([
            'name' => 'Device 1',
            'location' => 'Location 1',
            'purchase_date' => '2023-01-01',
            'in_use' => false,
            'user_id' => $user->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/devices');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data',
                'current_page',
                'total',
            ]);
    }

    public function test_user_can_filter_devices_by_location(): void
    {
        $token = $this->getAuthToken();
        $user = User::where('email', 'test@example.com')->first();

        DB::table('devices')->insert([
            ['name' => 'Device 1', 'location' => 'São Paulo', 'purchase_date' => '2023-01-01', 'in_use' => false, 'user_id' => $user->id, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Device 2', 'location' => 'Rio de Janeiro', 'purchase_date' => '2023-01-01', 'in_use' => false, 'user_id' => $user->id, 'created_at' => now(), 'updated_at' => now()],
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/devices?location=São Paulo');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_user_can_filter_devices_by_in_use(): void
    {
        $token = $this->getAuthToken();
        $user = User::where('email', 'test@example.com')->first();

        DB::table('devices')->insert([
            ['name' => 'Device 1', 'location' => 'Location', 'purchase_date' => '2023-01-01', 'in_use' => true, 'user_id' => $user->id, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Device 2', 'location' => 'Location', 'purchase_date' => '2023-01-01', 'in_use' => false, 'user_id' => $user->id, 'created_at' => now(), 'updated_at' => now()],
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/devices?in_use=1');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_user_can_update_device(): void
    {
        $token = $this->getAuthToken();
        $user = User::where('email', 'test@example.com')->first();

        $deviceId = DB::table('devices')->insertGetId([
            'name' => 'Device 1',
            'location' => 'Location 1',
            'purchase_date' => '2023-01-01',
            'in_use' => false,
            'user_id' => $user->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson("/api/devices/{$deviceId}", [
                'name' => 'Updated Device',
                'location' => 'Updated Location',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'name' => 'Updated Device',
                'location' => 'Updated Location',
            ]);
    }

    public function test_user_can_toggle_device_use(): void
    {
        $token = $this->getAuthToken();
        $user = User::where('email', 'test@example.com')->first();

        $deviceId = DB::table('devices')->insertGetId([
            'name' => 'Device 1',
            'location' => 'Location 1',
            'purchase_date' => '2023-01-01',
            'in_use' => false,
            'user_id' => $user->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/devices/{$deviceId}/use");

        $response->assertStatus(200)
            ->assertJson([
                'in_use' => true,
            ]);
    }

    public function test_user_can_delete_device(): void
    {
        $token = $this->getAuthToken();
        $user = User::where('email', 'test@example.com')->first();

        $deviceId = DB::table('devices')->insertGetId([
            'name' => 'Device 1',
            'location' => 'Location 1',
            'purchase_date' => '2023-01-01',
            'in_use' => false,
            'user_id' => $user->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson("/api/devices/{$deviceId}");

        $response->assertStatus(200);

        $device = DB::table('devices')->where('id', $deviceId)->first();
        $this->assertNotNull($device->deleted_at);
    }

    public function test_user_cannot_access_other_user_devices(): void
    {
        $user1 = User::create([
            'name' => 'User 1',
            'email' => 'user1@example.com',
            'password' => Hash::make('password123'),
        ]);

        $user2 = User::create([
            'name' => 'User 2',
            'email' => 'user2@example.com',
            'password' => Hash::make('password123'),
        ]);

        $deviceId = DB::table('devices')->insertGetId([
            'name' => 'Device 1',
            'location' => 'Location 1',
            'purchase_date' => '2023-01-01',
            'in_use' => false,
            'user_id' => $user1->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $token = $user2->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson("/api/devices/{$deviceId}");

        $response->assertStatus(404);
    }
}
