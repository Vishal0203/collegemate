<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

//        $this->call(UsersTableSeed::class);
//        $this->call(InstituteTableSeed::class);
//        $this->call(UsersInstituteSeed::class);
//        $this->call(CategorySeed::class);
//        $this->call(NotificationDataSeeder::class);
        $this->call(PostSeeder::class);
        Model::reguard();
    }
}
