<?php

use Illuminate\Database\Seeder;
use App\NotificationData;

class NotificationSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker\Factory::create('en_US');

        foreach (range(1, 50) as $index) {
            NotificationData::create([
                'notification_guid' => $faker->uuid,
                'inst_notification_id' => rand(1, 10),
                'notification_head' => $faker->sentence($nbWords = 6),
                'notification_body' => $faker->realText($maxNbChars = 200, $indexSize = 2),
                'created_by' => rand(1, 20),
            ]);
        }
    }
}
