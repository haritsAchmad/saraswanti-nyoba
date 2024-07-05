<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request;
use App\Models\PenjualanMaster;
use Illuminate\Validation\Rule;
use DataTables;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;

class PenjualanMasterController extends Controller
{
    protected $penjualanmaster;

    public function __construct(PenjualanMaster $penjualanmaster)
    {
        $this->penjualanmaster = $penjualanmaster;
    }

    public function index()
    {
        $y = PenjualanMaster::all();


        return response()->json($y);
    }
}