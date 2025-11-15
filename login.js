document.addEventListener("DOMContentLoaded", () => {
    // function onSignIn(googleUser) {
    //     var profile = googleUser.getBasicProfile();
    //     console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //     console.log('Name: ' + profile.getName());
    //     console.log('Image URL: ' + profile.getImageUrl());
    //     console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    // }
    function handleCredentialResponse(response) {
      // Google sends back a JWT token
      const jwt = response.credential;

      console.log("JWT ID Token:", jwt);

      // Decode it (optional: only for front-end display)
      const payload = JSON.parse(atob(jwt.split('.')[1]));

      console.log("User Info:", payload);

      // Example: show user info
      document.getElementById("userInfo").innerHTML = `
          <p><strong>Name:</strong> ${payload.name}</p>
          <p><strong>Email:</strong> ${payload.email}</p>
          <img src="${payload.picture}" />
      `;
  }
    
})