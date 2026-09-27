<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Request;
use App\Core\Response;
use App\Core\Session;
use App\Core\Validator;

class AuthController extends BaseController
{
    public function showLogin(Request $request): Response
    {
        if (Auth::check()) {
            return $this->redirect('/dashboard');
        }
        return $this->view('auth.login', [
            'error'   => Session::getFlash('error'),
            'success' => Session::getFlash('success'),
        ]);
    }

    public function login(Request $request): Response
    {
        if (!$this->validateCSRF($request)) {
            Session::flash('error', 'اعتبار توکن امنیتی فرم منقضی شده است. لطفاً مجدداً تلاش نمایید.');
            return $this->redirect('/login');
        }

        $validator = Validator::make($request->all(), [
            'identifier' => 'required',
            'password'   => 'required|min:6',
        ]);

        if ($validator->fails()) {
            Session::flash('error', $validator->firstError());
            return $this->redirect('/login');
        }

        $identifier = trim((string) $request->input('identifier'));
        $password = (string) $request->input('password');

        if (Auth::attempt($identifier, $password)) {
            $user = Auth::user();
            Session::flash('success', "خوش آمدید، {$user->name}");
            return $this->redirect('/dashboard');
        }

        return $this->redirect('/login');
    }

    public function logout(Request $request): Response
    {
        Auth::logout();
        return $this->redirect('/login');
    }
}
