<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PenjualanDetail extends Model
{
    use HasFactory;

    protected $connection = 'mysqlsecond';
    protected $table = 'pj_penjualan_detail';
    protected $primaryKey = 'id_penjualan_d';
    public $timestamps = false;

    protected $fillable = [
        'id_penjualan_m',
        'id_barang',
        'jumlah_beli',
        'harga_satuan',
        'total',

    ];
}
