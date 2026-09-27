<?php
declare(strict_types=1);

namespace App\Core;

class Validator
{
    private array $data;
    private array $errors = [];

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public static function make(array $data, array $rules): self
    {
        $validator = new self($data);
        $validator->validate($rules);
        return $validator;
    }

    public function validate(array $rules): void
    {
        foreach ($rules as $field => $fieldRules) {
            $value = $this->data[$field] ?? null;
            $ruleList = is_string($fieldRules) ? explode('|', $fieldRules) : $fieldRules;

            foreach ($ruleList as $rule) {
                $params = [];
                if (str_contains($rule, ':')) {
                    [$rule, $paramStr] = explode(':', $rule, 2);
                    $params = explode(',', $paramStr);
                }

                switch ($rule) {
                    case 'required':
                        if ($value === null || $value === '' || (is_array($value) && empty($value))) {
                            $this->addError($field, "فیلد {$field} الزامی است.");
                        }
                        break;

                    case 'min':
                        $min = (int) $params[0];
                        if (is_string($value) && mb_strlen($value) < $min) {
                            $this->addError($field, "فیلد {$field} باید حداقل {$min} کاراکتر باشد.");
                        } elseif (is_numeric($value) && $value < $min) {
                            $this->addError($field, "فیلد {$field} باید حداقل {$min} باشد.");
                        }
                        break;

                    case 'max':
                        $max = (int) $params[0];
                        if (is_string($value) && mb_strlen($value) > $max) {
                            $this->addError($field, "فیلد {$field} نباید بیشتر از {$max} کاراکتر باشد.");
                        }
                        break;

                    case 'numeric':
                        if ($value !== null && $value !== '' && !is_numeric($value)) {
                            $this->addError($field, "فیلد {$field} باید عددی باشد.");
                        }
                        break;

                    case 'email':
                        if ($value !== null && $value !== '' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                            $this->addError($field, "فرمت ایمیل نامعتبر است.");
                        }
                        break;

                    case 'iran_mobile':
                        if ($value !== null && $value !== '' && !preg_match('/^09[0-9]{9}$/', (string)$value)) {
                            $this->addError($field, "شماره موبایل وارد شده معتبر نیست (باید ۱۱ رقم و با ۰۹ شروع شود).");
                        }
                        break;
                }
            }
        }
    }

    private function addError(string $field, string $message): void
    {
        if (!isset($this->errors[$field])) {
            $this->errors[$field] = $message;
        }
    }

    public function fails(): bool
    {
        return !empty($this->errors);
    }

    public function errors(): array
    {
        return $this->errors;
    }

    public function firstError(): ?string
    {
        return reset($this->errors) ?: null;
    }
}
