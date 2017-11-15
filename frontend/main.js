$(document).ready(function() {

  function hidePageOne() {
    $("#basefs-one").hide();
  }

  function showPageOne() {
    $("#basefs-one").show();
  }

  function hidePageTwo() {
    $("#basefs-two").hide();
  }

  function showPageTwo() {
    $("#basefs-two").show();
  }

  function showSelfServe() {
    $("#basefs-two-form").hide();
    $("[data-fs=heading]").text("Thank you for interest!");
    $("[data-fs=description]").text("Here's your demo:");
    showVideo("ZlLmIHa6Kew");
  }

  function showMQL() {
    $("#basefs-two-form").hide();
    $("[data-fs=heading]").text("Thank you for interest!");
    $("[data-fs=description]").text("Someone will be in touch shortly with details about your demo.");
    showVideo("t_T5NG6an00");
  }

  function showVideo(key) {
    $("#basefs-two").append("<iframe class='fs__video' src='https://www.youtube.com/embed/" + key + "?autoplay=1&rel=0' frameborder='0' allowfullscreen></iframe>");
  }

  function personalizeForm(email, res) {
    // end the loading animation
    hidePageOne();
    showPageTwo();

    if (typeof res === 'undefined') return;

    // change the messaging
    $("[data-fs=description]").text("Are these your company details? Please correct any detail we missed and hit submit when you're done to get your free demo.");

    // update form values
    var form = $("#basefs-two-form"),
        firstname = res.person.name.givenName,
        lastname = res.person.name.familyName,
        company = res.company.name,
        employees = res.company.metrics.employees;

    if (firstname) form.find("[name=firstname]").val(firstname).change();
    if (lastname) form.find("[name=lastname]").val(lastname).change();
    if (company) form.find("[name=company]").val(company).change();

    if (employees >= 1001) {
      form.find("input[value='1001+']").prop("checked", true).change();
    } else if (employees >= 201) {
      form.find("input[value='201-1000']").prop("checked", true).change();
    } else if (employees >= 50) {
      form.find("input[value='51-200']").prop("checked", true).change();
    } else if (employees >= 5) {
      form.find("input[value='5-50']").prop("checked", true).change();
    } else if (employees >= 1) {
      form.find("input[value='1-4']").prop("checked", true).change();
    } else {}

  }

  function getEnrichedData(email) {
    var res = {};
    $.ajax({
        url: "http://localhost:5000/reach/?email=" + email,
        type: "GET",
        timeout: 10000
      }).done(function(data) {
        res = JSON.parse(data);
        // analytics.track("Reach Enrichment Succeeded", {email: email});
        personalizeForm(email, res);

      }).fail(function(jqXHR, textStatus) {
        // analytics.track("Reach Enrichment Failed", {email: email});
        personalizeForm(email);

      });
  }

  function createForms() {
    hbspt.forms.create({
      portalId: '241722',
      formId: 'c2c0ea12-bb98-47da-88dc-45e142785f54',
      css: '',
      target: '#basefs-one-form',
      onFormSubmit: function(form) {
        var email = form.find("[name=email]").val();
        $("#basefs-two-form [name=email]").val(email).change();
        getEnrichedData(email);
        // show the loading animation
      }
    });
    hbspt.forms.create({
      portalId: '241722',
      formId: '5ee4ab67-2bc4-4c57-a482-95cd33cc696a',
      css: '',
      target: '#basefs-two-form',
      onFormSubmit: function(form) {
        var employees = form.find("[name=company_size_radio_]:checked").val();
        if (employees == "1-4") {
          showSelfServe();
        } else {
          showMQL();
        }
      }
    });
  }

  hidePageTwo();
  createForms();

});