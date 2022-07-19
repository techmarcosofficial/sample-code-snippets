<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class Emailable extends Mailable {
    use Queueable, SerializesModels;

    protected $_params = [];
    protected $_from = [];
    protected $_to = null;
    protected $_cc = null;
    protected $_bcc = null;
    protected $_subject = "";
    protected $_template = "";
    protected $_attachments = "";
    protected $_custom_html = "";

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($options = []) {
        $defaultOptions = [
            'template' => 'default',
            'to' => env('ADMIN_EMAIL'),
            'cc' => null,
            'bcc' => null,
            'from' => ['address' => env('MAIL_FROM_ADDRESS'), 'name' => env('MAIL_FROM_NAME')],
            'subject' => env('APP_NAME'),
            'attachments' => [],
            'params' => [
                'appName' => env('APP_NAME'),
                'appUrl' => env('APP_URL'),
            ],
            'custom_html' => null,
        ];

        //echo "<pre>"; print_r($defaultOptions); echo "</pre>";
        
        if (!empty($options['from'])) {
            $options['from'] = array_merge($defaultOptions['from'], $options['from']);
        }

        if (!empty($options['params'])) {
            $options['params'] = array_merge($defaultOptions['params'], $options['params']);
        }

        if (!empty($options['attachments'])) {
            $options['attachments'] = array_merge($defaultOptions['attachments'], $options['attachments']);
        }

        $finalOptions = array_merge($defaultOptions, $options);

        

        if(empty($finalOptions['from']['address'])){
            $finalOptions['from']['address'] = 'subpop@techmarcos.com';
        }

        if(empty($finalOptions['from']['name'])){
            $finalOptions['from']['name'] = 'ADM INC';
        }

       // dd($finalOptions);

        $this->_from = $finalOptions['from'];
        $this->_to = $finalOptions['to'];
        $this->_cc = $finalOptions['cc'];
        $this->_bcc = $finalOptions['bcc'];
        $this->_subject = $finalOptions['subject'];
        $this->_params = $finalOptions['params'];
        $this->_template = $finalOptions['template'];
        $this->_attachments = $finalOptions['attachments'];
        $this->_custom_html = $finalOptions['custom_html'];
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build() {
        $mailable = $this->from($this->_from)
            ->to($this->_to)
            ->subject($this->_subject)
            ->markdown('emails.' . $this->_template, [
                'params' => $this->_params,
                'custom_html' => $this->replaceVariables($this->_custom_html)
            ]);

        if ($this->_cc != null) {
            $mailable->cc($this->_cc);
        }

        if ($this->_bcc != null) {
            $mailable->cc($this->_bcc);
        }

        return $mailable;
    }

    /**
     * Build the body with dynamic data.
     *
     * @return $body
     */
    public function replaceVariables($_custom_html) {
        $body = null;
        if ($_custom_html) {
            $body = $_custom_html->body;
            $this->_params['appName'] = env('APP_NAME');
            foreach ($this->_params as $key => $value) {
                $body = preg_replace('/\{\s*' . $key . '\s*\}/is', $value, $body);
            }
        }

        return $body;
    }
}
