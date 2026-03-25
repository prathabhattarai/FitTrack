Set-Location "c:\Users\Pratha Bhattarai\rough"

git init
git remote add origin https://github.com/prathabhattarai/FitTrack.git
git checkout -b main -ErrorAction SilentlyContinue

if (!(Test-Path .gitignore)) {
    Out-File -FilePath .gitignore -InputObject "node_modules/`n.env`n.DS_Store" -Encoding ASCII
}
git add .gitignore
git commit -m "chore: setup project .gitignore rules"

git add backend/package.json
git commit -m "chore: initialize backend node environment"

git add backend/src/server.js
git commit -m "feat: add entry point server.js for application start"

git add backend/src/app.js
git commit -m "feat: construct express application structure in app.js"

git add backend/src/config/env.js
git commit -m "chore: parse environment configuration centrally"

git add backend/src/config/database.js
git commit -m "chore: attach db parameters to sequelize config"

git add backend/src/utils/mailer.js
git commit -m "feat: implement Nodemailer robust utility for emailing"

git add backend/src/middlewares/errorHandler.js
git commit -m "fix: introduce a global error handling middleware"

git add backend/src/middlewares/authMiddleware.js
git commit -m "security: construct strict JSON Web Token middleware"

git add backend/src/middlewares/roleMiddleware.js
git commit -m "security: build role-dependent proxy authorization"

git add backend/src/middlewares/validateMiddleware.js
git commit -m "chore: map joi specifications to validation middleware"

git add backend/src/models/index.js
git commit -m "chore: bootstrap automatic sequelize bindings index"

git add backend/src/models/user.js
git commit -m "feat: formulate normalized User model and relations"

git add backend/src/models/memberdetail.js
git commit -m "feat: formulate MemberDetail expansion model"

git add backend/src/models/membershipplan.js
git commit -m "feat: formulate MembershipPlan product model"

git add backend/src/models/trainer.js
git commit -m "feat: formulate core Trainer properties model"

git add backend/src/models/payment.js
git commit -m "feat: formulate transactional Payment model tracking"

git add backend/src/models/attendance.js
git commit -m "feat: formulate chronological Attendance tracker model"

git add backend/src/models/booking.js
git commit -m "feat: formulate relationship Booking management model"

git add backend/src/db/migrations/20260319145519-create-user.js
git commit -m "chore: snapshot user schema DDL deployment"

git add backend/src/db/migrations/20260319145520-create-member-detail.js
git commit -m "chore: snapshot member_details logical DDL migration"

git add backend/src/db/migrations/20260319145518-create-membership-plan.js -ErrorAction SilentlyContinue
git commit -m "chore: snapshot membership_plans database tables creation"

git add backend/src/db/migrations/20260319145521-create-trainer.js
git commit -m "chore: snapshot trainers migration table structure"

git add backend/src/db/migrations/20260319145524-create-payment.js
git commit -m "chore: snapshot payments table configuration"

git add backend/src/db/migrations/20260319145525-create-attendance.js
git commit -m "chore: snapshot attendances table deployment script"

git add backend/src/db/migrations/20260319145527-create-booking.js
git commit -m "chore: snapshot bookings schema generation"

git add backend/src/db/migrations/20260319150937-add-otp-to-users.js
git commit -m "feat: alter users schema to append resilient OTP parameters"

git add backend/src/db/seeders/20260319150000-demo-data.js
git commit -m "test: inject master administrator and default plans"

git add backend/src/controllers/authController.js
git commit -m "feat: craft powerful multi-stage auth and 2FA controller"

git add backend/src/controllers/adminController.js
git commit -m "feat: expose administrative statistics and control dashboard"

git add backend/src/controllers/memberController.js
git commit -m "feat: implement self-service member plan subscriptions"

git add backend/src/controllers/trainerController.js
git commit -m "feat: abstract trainer listing and operational scheduling"

git add backend/src/controllers/attendanceController.js
git commit -m "feat: secure check-in flow constraints in attendance handler"

git add backend/src/controllers/paymentController.js
git commit -m "feat: trace financial payment checkpoints and history"

git add backend/src/routes/auth.routes.js
git commit -m "feat: route authentication schema validation and entry"

git add backend/src/routes/admin.routes.js
git commit -m "feat: secure elevated admin pipeline router points"

git add backend/src/routes/member.routes.js
git commit -m "feat: wire operational routing mapped to members module"

git add backend/src/routes/trainer.routes.js
git commit -m "feat: route scheduling constraints for client bookings"

git add backend/src/routes/attendance.routes.js
git commit -m "feat: attach checking flow route endpoints mapping"

git add backend/src/routes/payment.routes.js
git commit -m "feat: secure tracking endpoints against payment logs"

git add backend/src/routes/index.js
git commit -m "chore: consolidate multi-layered REST resources index"

git add backend/README.md
git commit -m "docs: finalize extensive backend startup and test plans"

# Front end parts
git add my-app/src/components/pages/Auth/Register.jsx
git commit -m "feat(ui): upgrade custom registration view injecting network redirection"

git add my-app/src/components/pages/Auth/Login.jsx
git commit -m "feat(ui): hook live network backend to existing login interface"

git add my-app/src/components/pages/Auth/VerifyAccount.jsx
git commit -m "feat(ui): construct minimal isolated OTP checking module"

git add my-app/src/components/pages/Auth/ForgotPassword.jsx
git commit -m "feat(ui): develop external password recovery invocation form"

git add my-app/src/components/pages/Auth/ResetPassword.jsx
git commit -m "feat(ui): implement multi-field 2FA password resetting confirmation"

git add my-app/src/App.js
git commit -m "chore(ui): mutate react application routes targeting authentications"

# Adding remaining
git add .
git commit -m "refactor: wrap application environment dependencies and formatting"

Write-Host "Done committing locally!"
