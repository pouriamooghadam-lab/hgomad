<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Models\CsatSurvey;
use App\Models\Technician;

class SurveyController extends BaseController
{
    public function index(Request $request): Response
    {
        $surveys = CsatSurvey::all('id DESC');
        return $this->json(['success' => true, 'data' => $surveys]);
    }

    public function submit(Request $request): Response
    {
        $jobId = (int)$request->input('job_id');
        $rating = (int)$request->input('rating', 5);
        $comment = trim($request->input('comment', ''));
        $technicianId = (int)$request->input('technician_id');

        $rating = max(1, min(5, $rating));

        $id = CsatSurvey::create([
            'job_id' => $jobId,
            'technician_id' => $technicianId,
            'score' => $rating,
            'feedback' => $comment,
            'created_at' => date('Y-m-d H:i:s'),
        ]);

        // Recalculate technician average rating
        if ($technicianId > 0) {
            $tech = Technician::find($technicianId);
            if ($tech) {
                $surveys = CsatSurvey::where('technician_id', (string)$technicianId);
                $totalScore = array_reduce($surveys, fn($acc, $s) => $acc + (int)$s->score, 0);
                $count = count($surveys);
                if ($count > 0) {
                    $tech->rating = round($totalScore / $count, 1);
                    $tech->save();
                }
            }
        }

        return $this->json(['success' => true, 'id' => $id, 'message' => 'نظر و امتیاز شما با سپاس ثبت شد.']);
    }
}
