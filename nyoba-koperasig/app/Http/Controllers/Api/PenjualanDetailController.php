<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request;
use App\Models\PenjualanDetail;
use Illuminate\Validation\Rule;
use DataTables;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;

class PenjualanDetailController extends Controller
{
    protected $penjualandetail;

    public function __construct(PenjualanDetail $penjualandetail)
    {
        $this->penjualandetail = $penjualandetail;
    }

    public function index()
    {
        $y = PenjualanDetail::all();


        return response()->json($y);
    }
}