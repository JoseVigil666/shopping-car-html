<!DOCTYPE html>
<html>
<head>
  <title>FESA</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <style>
    body, h1,h2,h3,h4,h5,h6 {font-family: "Montserrat", sans-serif}
    .w3-row-padding img {margin-bottom: 12px}
    /* Set the width of the sidebar to 120px */
    .w3-sidebar {width: 120px;background: #222;}
    /* Add a left margin to the "page content" that matches the width of the sidebar (120px) */
    #main {margin-left: 120px}
    /* Remove margins from "page content" on small screens */
    @media only screen and (max-width: 600px) {#main {margin-left: 0}}

    .error {color: orange;}

  </style>
</head>
<body class="w3-black">

<?php
  $xtxtlistproduct = "";
  $xtxtlistproduct = clear_input($_POST["txtlistproduct"]);
  // echo $xtxtlistproduct;
  // echo "web site in construction";

  function clear_input($data) {
      $data = trim($data);
      $data = stripslashes($data);
      $data = htmlspecialchars($data);
      return $data;
    }

  // define variables and set to empty values
  $nameErr = $emailErr = $telephoneErr = "";
  $name = $email = $comment = $telephone = "";
  $f1 = $f2 = $f3 = "True";

  if ($_SERVER["REQUEST_METHOD"] == "POST") {
      if (empty($_POST["name"])) {
        $nameErr = " is required";
        $f1 = "False";
      } else {
        $name = test_input($_POST["name"]);
        // check if name only contains letters and whitespace
        if (!preg_match("/^[a-zA-Z ]*$/",$name)) {
          $nameErr = ". Only letters and white space allowed";
          $f1 = "False";
        }
      }

      if (empty($_POST["email"])) {
        $emailErr = " is required";
        $f2 = "False";
      } else {
        $email = test_input($_POST["email"]);
        // check if e-mail address is well-formed
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
          $emailErr = ". Invalid email format";
          $f2 = "False";
        }
      }

      if (empty($_POST["telephone"])) {
        $telephone = "";
      } else {
        $telephone = test_input($_POST["telephone"]);
        // check if URL address syntax is valid (this regular expression also allows dashes in the URL)
        if (!preg_match("/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/",$telephone)) {
          $telephoneErr = "Invalid Number.. please check format: ###-###-####";
          $f3 = "False";
        }
      }

      if (empty($_POST["comment"])) {
        $comment = "";
      } else {
        $comment = test_input($_POST["comment"]);
      }

    }

    function test_input($data) {
      $data = trim($data);
      $data = stripslashes($data);
      $data = htmlspecialchars($data);
      return $data;
    }
?>

<!-- Page Content -->
<div class="w3-container" id="main">

  <!-- Contact Section -->
  <div class="w3-padding-64 w3-content w3-text-grey form-group" id="contact">
    <h2 class="w3-text-light-grey">Contact Me</h2>
    <hr style="width:200px" class="w3-opacity">
    <p>Lets get in touch. Send me a message:</p>

<!-- backup
    <form action="  sendmsg.php" target="_blank">
      <p><input class="w3-input w3-padding-16" type="text" placeholder="Name"    ></p>
      <p><input class="w3-input w3-padding-16" type="text" placeholder="Email"   ></p>
      <p><input class="w3-input w3-padding-16" type="text" placeholder="Subject" ></p>
      <p><input class="w3-input w3-padding-16" type="text" placeholder="Message" ></p>
      <p>
        <button class="w3-button w3-light-grey w3-padding-large" onclick="" type="submit">
          <i class="fa fa-paper-plane"></i> SEND MESSAGE
        </button>
      </p>
    </form>

    <input type="submit" name="submit" value="Submit">

 End Contact Section -->

    <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">

        Name: <span class="error">* <?php echo $nameErr;?></span>
        <input class="w3-input w3-padding-8" type="text" placeholder="contact name" name="name" value="<?php echo $name;?>">

        <br>
        E-mail: <span class="error">* <?php echo $emailErr;?></span>
        <input class="w3-input w3-padding-8" type="text" placeholder="Email" name="email" value="<?php echo $email;?>">

        <br>
        Telephone: <span class="error"><?php echo $telephoneErr;?></span>
        <input class="w3-input w3-padding-8" placeholder="for contact" type="text" name="telephone" value="<?php echo $telephone;?>">

        Comment:
        <br>
        <textarea class="form-control" style="width:100%" name="comment" rows="5" ><?php echo $xtxtlistproduct;?></textarea>
        <br>
        <br>
        <button class="w3-button w3-light-grey w3-padding-large" onclick="" type="submit">
          <i class="fa fa-paper-plane"></i> SEND MESSAGE
        </button>

        <?php
          echo '<BUTTON class="w3-button w3-light-grey w3-padding-large" onclick="window.close();">CLOSE ME.</BUTTON>';
        ?>


    </form>
    <p><span class="error">* required field</span></p>
    <!-- End Contact Section -->
  </div>

<?php
  echo "<h2>Important Message:</h2><br>";
  if ($f1 == "True" and $f2 == "True" and $f3 == "True" and $_SERVER["REQUEST_METHOD"] == "POST") {
      require 'class.simple_mail.php';
      $mail = SimpleMail::make()
          ->setTo($email, 'Customer')
          ->setSubject("Contact from Fesadental.com")
          ->setFrom('fesadentalorders@gmail.com', 'FESA-orders')
          ->setCc(['fesadentalorders@gmail.com','Copy'])
          ->addGenericHeader('X-Mailer', 'www.fesadental.com')
          ->setHtml()
          ->setMessage("$comment $xtxtlistproduct <strong> <br> Thanks for contact Us. <br> Fesa Dental Supply Inc <br> 43-47 44th St 2nd Floor Sunnyside Ny 11104 USA. <br>Telephone: +1 (718) 592-6783 </strong> ")
          ->setWrap(78);
      $send = $mail->send();
      // echo $mail->debug();
      // ->setMessage("$comment $xtxtlistproduct <strong> <br> Thanks for contact Us. <br> Fesa Dental Supply Inc <br> 43-47 44th St 2nd Floor Sunnyside Ny 11104 USA. <br>Telephone: +1 (718) 592-6783 </strong> ")
      if ($send) {
          //echo $email;
          //echo $comment;
          //echo $xtxtlistproduct;
          echo 'Email was sent successfully!';
        //  echo "<script>alert('Exito')</script>"
      } else {
          echo 'An error occurred. We could not send email';
      }
    }
?>

<!-- END PAGE CONTENT -->
</div>

</body>
</html>
