<?php
require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../bootstrap/app.php';

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Boot the application kernel to use Eloquent
$kernel = app()->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = User::where('email','admin@example.com')->first();
if (!$user) {
    echo "NO_USER\n";
    exit(0);
}

echo "email=".$user->email."\n";
echo "password_hash=".$user->password."\n";
echo "hash_check_password=".(Hash::check('password',$user->password) ? 'MATCH' : 'NO_MATCH')."\n";
