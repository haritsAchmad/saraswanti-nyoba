<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request;
use App\Models\Session;
use Illuminate\Validation\Rule;
use DataTables;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;

class SessionController extends Controller
{
    protected $session;

    public function __construct(Session $session)
    {
        $this->session = $session;
    }

    public function index()
    {
        $y = Session::all();


        return response()->json($y);
    }
}