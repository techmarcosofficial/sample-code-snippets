<?php

namespace App\Controller\Component;

use Cake\Controller\Component;
use Cake\Mailer\Email;
use Cake\Network\Exception\NotFoundException;
use Cake\Mailer\TransportFactory;

class EmailManagerComponent extends Component {

    private $emailResponse;

    public function sendEmail($options = []) {

        $this->emailResponse['error'] = true;
        $defaultOptions = [
            'config'      => 'default',
            'template'    => 'default',
            'layout'      => 'default',
            'emailFormat' => 'both',
            'to'          => null,
            'cc'          => null,
            'bcc'         => null,
            'from'        => [SMTP_USER => SITE_TITLE],
            'sender'      => [SMTP_USER => SITE_TITLE],
            'replyTo'      => [SMTP_USER => SITE_TITLE],
            'subject'     => SITE_TITLE,
            'viewVars'    => [
                'logo'    => SITE_URL . "img/logo-aptnet.png",
                'appName' => SITE_TITLE,
                'appUrl'  => SITE_URL
            ]
        ];

        if (!empty($options['viewVars'])) {
            $options['viewVars'] = array_merge($defaultOptions['viewVars'], $options['viewVars']);
        }

        $finalOptions = array_merge($defaultOptions, $options);

        extract($finalOptions);
        $hasDestination = false;

        $configT = TransportFactory::getConfig($config);



        
            $email = new Email();
            $email->setFrom($from);
            $email->viewBuilder()->setTemplate($template);

            $email->viewBuilder()->setLayout($layout);
            $email->setProfile($configT);
            if ($to != null) {
                if (is_array($to)) {
                    $email->setTo($to);
                    $hasDestination = true;
                } else {
                    if (filter_var($to, FILTER_VALIDATE_EMAIL)) {
                        $email->setTo($to);
                        $hasDestination = true;
                    } else {
                        $hasDestination = false;
                    }
                }
            }

            if ($cc != null) {
                if (filter_var($cc, FILTER_VALIDATE_EMAIL)) {
                    $email->setCc($cc);
                    $hasDestination = true;
                } else {
                    if (!$hasDestination)
                        $hasDestination = false;
                }
            }

            if ($bcc != null) {
                if (is_array($bcc)) {
                    $email->setBcc($bcc);
                    $hasDestination = true;
                } else {
                    if (filter_var($bcc, FILTER_VALIDATE_EMAIL)) {
                        $email->setBcc($bcc);
                        $hasDestination = true;
                    } else {
                        $hasDestination = false;
                    }
                }
            } 


            if ($sender != null) {
                $email->setSender(array_keys($sender)[0], array_Values($sender)[0]);
            }


            if ($replyTo != null) {
                $email->setReplyTo(array_keys($replyTo)[0], array_Values($replyTo)[0]);
            }

            $email->setEmailFormat($emailFormat);
            $email->setSubject($subject);
            $email->setViewVars($viewVars);
            try {    
                if ($hasDestination) {
                    $this->emailResponse['error'] = false;
                    $this->emailResponse['status'] = 'Email Sent';
                    try{    
                        $email->send();
                    } catch (\Exception $e) {
                        $this->emailResponse['error'] = true;
                        $this->emailResponse['status'] = $e->getMessage();        
                        //pr($e->getMessage()); die;
                    }
                } else {
                    $this->emailResponse['status'] = 'Email did not send, destination email not found';
                }
            } catch (\Exception $e) {
                $this->emailResponse['error'] = true;
                $this->emailResponse['status'] = 'Destination email not found';
            }
        return $this->emailResponse;
         try{     
             if ($hasDestination) {
                 $resp = $email->send();
                 $this->emailResponse['error'] = false;
                 $this->emailResponse['status'] = 'Email Sent';
                 $this->emailResponse['message_id'] = $email->getMessageId();
                 $this->emailResponse['last_response'] = $email->getTransport()->getLastResponse();
                 $this->emailResponse['receipt'] = $email->getReadReceipt();
                 $this->emailResponse['to'] = $to;
             } else {
                 $this->emailResponse['error'] = true;
                 $this->emailResponse['to'] = $to;
                 $this->emailResponse['status'] = 'Email did not send, destination email not found';
                 $this->emailResponse['last_response'] = $email->getTransport()->getLastResponse();
             }
         } catch (\Exception $e) {
             $this->emailResponse['error'] = true;
             $this->emailResponse['status'] = 'Email Failed';
             $this->emailResponse['to'] = $to;
             $this->emailResponse['message'] = 'Destination email not found';
             $this->emailResponse['last_response'] = $email->getTransport()->getLastResponse();
         }
        return $this->emailResponse;
    }

}
