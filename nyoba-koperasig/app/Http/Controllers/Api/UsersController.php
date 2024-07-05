<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request;
use App\Models\Users;
use Illuminate\Validation\Rule;
use DataTables;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;

class UsersController extends Controller
{
    protected $users;

    public function __construct(Users $users)
    {
        $this->users = $users;
    }

    public function index()
    {
        $y = Users::all();


        return response()->json($y);
    }
}