<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PenjualanMaster extends Model
{
    use HasFactory;

    protected $connection = 'mysqlsecond';
    protected $table = 'pj_penjualan_master';
    protected $primaryKey = 'id_penjualan_m';
    public $timestamps = false;

    protected $fillable = [
        'nomor_nota',
        'tanggal',
        'grand_total',
        'bayar',
        'keterangan_lain',
        'id_pelanggan',
        'id_user',
    ];
}
