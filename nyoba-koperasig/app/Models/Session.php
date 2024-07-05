<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    use HasFactory;

    protected $connection = 'mysqlsecond';
    protected $table = 'pj_ci_sessions';
    protected $primaryKey = 'id';
    //public $timestamps = false;

    protected $fillable = [
        'ip_address',
        'timestamp',
        'data',
    ];
}
