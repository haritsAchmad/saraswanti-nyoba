<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pelanggan extends Model
{
    use HasFactory;

    protected $connection = 'mysqlsecond';
    protected $table = 'pj_pelanggan';
    protected $primaryKey = 'id_pelanggan';
    public $timestamps = false;

    protected $fillable = [
        'nama',
        'alamat',
        'telp',
        'info_tambahan',
        'kode_unik',
        'waktu_input',
        'dihapus',
    ];
}
