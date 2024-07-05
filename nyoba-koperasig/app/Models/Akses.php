<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Akses extends Model
{
    use HasFactory;

    protected $connection = 'mysqlsecond';
    protected $table = 'pj_akses';
    protected $primaryKey = 'id_akses';
    public $timestamps = false;

    protected $fillable = [
        'label',
        'level_akses',
    ];
}
