const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Helper for generating Algerian-style names
const firstNames = ['Mohamed', 'Ahmed', 'Yassine', 'Karim', 'Amine', 'Youcef', 'Omar', 'Ali', 'Fatima', 'Amina', 'Meriem', 'Khadija', 'Sarah', 'Nadia', 'Samia', 'Leila'];
const lastNames = ['Benali', 'Hadj', 'Mekhloufi', 'Benmoussa', 'Cherif', 'Boudiaf', 'Benchaa', 'Ferhat', 'Taleb', 'Hamdi', 'Mansouri', 'Kaddour', 'Djabou', 'Saadi'];
const cities = ['Alger', 'Oran', 'Constantine', 'Blida', 'Sétif', 'Annaba', 'Tlemcen', 'Batna', 'Béjaïa', 'Skikda'];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePhoneNumber() {
  const prefixes = ['055', '056', '066', '065', '067', '077', '079'];
  const prefix = randomElement(prefixes);
  const number = Math.floor(1000000 + Math.random() * 9000000);
  return `${prefix}${number.toString().substring(1)}`;
}

function generatePatientNumber(index) {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `PAT-${date}-${index.toString().padStart(4, '0')}`;
}

async function main() {
  console.log('Starting seed process for MUCHOUAR CLINIQUE...');

  try {
    // 1. Clear existing data in reverse order of dependencies
    console.log('Clearing existing data...');
    await prisma.$transaction([
      prisma.maintenanceTicket.deleteMany(),
      prisma.cleaningTask.deleteMany(),
      prisma.expense.deleteMany(),
      prisma.invoiceItem.deleteMany(),
      prisma.invoice.deleteMany(),
      prisma.prescriptionItem.deleteMany(),
      prisma.prescription.deleteMany(),
      prisma.consultation.deleteMany(),
      prisma.appointment.deleteMany(),
      prisma.labTest.deleteMany(),
      prisma.medication.deleteMany(),
      prisma.inventoryItem.deleteMany(),
      prisma.room.deleteMany(),
      prisma.patient.deleteMany(),
      prisma.insuranceCompany.deleteMany(),
      prisma.clinicSetting.deleteMany(),
      prisma.doctor.deleteMany(),
      prisma.nurse.deleteMany(),
      prisma.employee.deleteMany(),
      prisma.auditLog.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    // 2. Settings
    console.log('Creating settings...');
    await prisma.clinicSetting.create({
      data: {
        key: 'CLINIC_NAME',
        value: 'MUCHOUAR CLINIQUE',
        description: 'Nom de la clinique',
      }
    });

    // 3. Insurance Companies
    console.log('Creating insurance companies...');
    const insurances = [
      { name: 'CNAS', email: 'contact@cnas.dz', phone: '021234567', address: 'Alger Centre', coverageRate: 80 },
      { name: 'CASNOS', email: 'contact@casnos.dz', phone: '021234568', address: 'Ben Aknoun, Alger', coverageRate: 80 },
      { name: 'SAA Assurance', email: 'contact@saa.dz', phone: '021234569', address: 'Bab Ezzouar, Alger', coverageRate: 100 },
      { name: 'Alliance Assurances', email: 'contact@alliance.dz', phone: '021234570', address: 'Hydra, Alger', coverageRate: 100 },
      { name: 'Macir Vie', email: 'contact@macirvie.dz', phone: '021234571', address: 'Cheraga, Alger', coverageRate: 100 },
    ];
    
    const createdInsurances = [];
    for (const ins of insurances) {
      createdInsurances.push(await prisma.insuranceCompany.create({ data: ins }));
    }

    // 4. Users
    console.log('Creating users...');
    const passwordHash = await bcrypt.hash('password123', 10);
    
    const usersData = [
      { email: 'admin@muchouar.dz', name: 'Admin', role: 'ADMIN' },
      { email: 'karim.benali@muchouar.dz', name: 'Dr. Karim Benali', role: 'DOCTOR' },
      { email: 'amina.hadj@muchouar.dz', name: 'Dr. Amina Hadj', role: 'DOCTOR' },
      { email: 'youcef.mekhloufi@muchouar.dz', name: 'Dr. Youcef Mekhloufi', role: 'DOCTOR' },
      { email: 'fatima.benmoussa@muchouar.dz', name: 'Dr. Fatima Zahra Benmoussa', role: 'DOCTOR' },
      { email: 'mohamed.cherif@muchouar.dz', name: 'Dr. Mohamed Cherif', role: 'DOCTOR' },
      { email: 'khadija.aouicha@muchouar.dz', name: 'Infirmière Khadija Aouicha', role: 'NURSE' },
      { email: 'meriem.boudiaf@muchouar.dz', name: 'Infirmière Meriem Boudiaf', role: 'NURSE' },
      { email: 'sarah.benchaa@muchouar.dz', name: 'Sarah Benchaa', role: 'RECEPTIONIST' },
      { email: 'nadia.ferhat@muchouar.dz', name: 'Nadia Ferhat', role: 'ACCOUNTANT' },
      { email: 'ahmed.taleb@muchouar.dz', name: 'Pharmacien Ahmed Taleb', role: 'PHARMACIST' },
      { email: 'yassine.hamdi@muchouar.dz', name: 'Technicien Yassine Hamdi', role: 'LAB_TECHNICIAN' },
      { email: 'aicha.nettoyage@muchouar.dz', name: 'Aicha', role: 'CLEANER' },
      { email: 'rachid.maintenance@muchouar.dz', name: 'Rachid', role: 'MAINTENANCE' },
      { email: 'mohamed.muchouar@muchouar.dz', name: 'Directeur Mohamed Muchouar', role: 'MANAGER' },
    ];

    const users = {};
    for (const u of usersData) {
      users[u.email] = await prisma.user.create({
        data: {
          email: u.email,
          name: u.name,
          password: passwordHash,
          role: u.role,
          isActive: true,
        }
      });
    }

    // 5. Employees, Doctors, Nurses
    console.log('Creating employees and medical staff...');
    
    // Admin & Staff Employees
    await prisma.employee.create({ data: { userId: users['admin@muchouar.dz'].id, firstName: 'Admin', lastName: 'System', position: 'Administrateur', department: 'IT', hireDate: new Date('2020-01-01'), salary: 150000, status: 'ACTIVE' } });
    await prisma.employee.create({ data: { userId: users['sarah.benchaa@muchouar.dz'].id, firstName: 'Sarah', lastName: 'Benchaa', position: 'Réceptionniste', department: 'Accueil', hireDate: new Date('2022-03-15'), salary: 50000, status: 'ACTIVE' } });
    await prisma.employee.create({ data: { userId: users['nadia.ferhat@muchouar.dz'].id, firstName: 'Nadia', lastName: 'Ferhat', position: 'Comptable', department: 'Finance', hireDate: new Date('2021-06-01'), salary: 80000, status: 'ACTIVE' } });
    await prisma.employee.create({ data: { userId: users['ahmed.taleb@muchouar.dz'].id, firstName: 'Ahmed', lastName: 'Taleb', position: 'Pharmacien', department: 'Pharmacie', hireDate: new Date('2020-11-15'), salary: 90000, status: 'ACTIVE' } });
    await prisma.employee.create({ data: { userId: users['yassine.hamdi@muchouar.dz'].id, firstName: 'Yassine', lastName: 'Hamdi', position: 'Technicien de Laboratoire', department: 'Laboratoire', hireDate: new Date('2023-01-10'), salary: 60000, status: 'ACTIVE' } });
    await prisma.employee.create({ data: { userId: users['aicha.nettoyage@muchouar.dz'].id, firstName: 'Aicha', lastName: 'Nettoyage', position: 'Agent de nettoyage', department: 'Entretien', hireDate: new Date('2021-02-01'), salary: 35000, status: 'ACTIVE' } });
    await prisma.employee.create({ data: { userId: users['rachid.maintenance@muchouar.dz'].id, firstName: 'Rachid', lastName: 'Maintenance', position: 'Technicien de maintenance', department: 'Maintenance', hireDate: new Date('2022-08-20'), salary: 55000, status: 'ACTIVE' } });
    await prisma.employee.create({ data: { userId: users['mohamed.muchouar@muchouar.dz'].id, firstName: 'Mohamed', lastName: 'Muchouar', position: 'Directeur Général', department: 'Direction', hireDate: new Date('2015-01-01'), salary: 300000, status: 'ACTIVE' } });

    // Doctors
    const doctorsData = [
      { email: 'karim.benali@muchouar.dz', first: 'Karim', last: 'Benali', spec: 'Cardiologie', fee: 4000 },
      { email: 'amina.hadj@muchouar.dz', first: 'Amina', last: 'Hadj', spec: 'Dermatologie', fee: 3500 },
      { email: 'youcef.mekhloufi@muchouar.dz', first: 'Youcef', last: 'Mekhloufi', spec: 'Pédiatrie', fee: 3000 },
      { email: 'fatima.benmoussa@muchouar.dz', first: 'Fatima Zahra', last: 'Benmoussa', spec: 'Gynécologie', fee: 4500 },
      { email: 'mohamed.cherif@muchouar.dz', first: 'Mohamed', last: 'Cherif', spec: 'Médecine Générale', fee: 2000 },
    ];

    const createdDoctors = [];
    for (let i = 0; i < doctorsData.length; i++) {
      const d = doctorsData[i];
      const emp = await prisma.employee.create({
        data: {
          userId: users[d.email].id,
          firstName: d.first,
          lastName: d.last,
          position: 'Médecin Spécialiste',
          department: 'Médical',
          hireDate: new Date(`201${5+i}-01-01`),
          salary: 180000,
          status: 'ACTIVE'
        }
      });
      const doc = await prisma.doctor.create({
        data: {
          employeeId: emp.id,
          specialty: d.spec,
          licenseNumber: `MED${20000+i}`,
          consultationFee: d.fee,
          isAvailable: true
        }
      });
      createdDoctors.push(doc);
    }

    // Nurses
    const nursesData = [
      { email: 'khadija.aouicha@muchouar.dz', first: 'Khadija', last: 'Aouicha', dept: 'Urgences' },
      { email: 'meriem.boudiaf@muchouar.dz', first: 'Meriem', last: 'Boudiaf', dept: 'Pédiatrie' },
    ];
    
    for (let i = 0; i < nursesData.length; i++) {
      const n = nursesData[i];
      const emp = await prisma.employee.create({
        data: {
          userId: users[n.email].id,
          firstName: n.first,
          lastName: n.last,
          position: 'Infirmière',
          department: 'Soins',
          hireDate: new Date(`202${i}-05-01`),
          salary: 65000,
          status: 'ACTIVE'
        }
      });
      await prisma.nurse.create({
        data: {
          employeeId: emp.id,
          department: n.dept,
          licenseNumber: `INF${10000+i}`,
        }
      });
    }

    // 6. Rooms
    console.log('Creating rooms...');
    const rooms = [];
    for (let i = 1; i <= 5; i++) {
      rooms.push({ number: `10${i}`, type: 'CONSULTATION', floor: 0, capacity: 1, status: 'AVAILABLE' });
      rooms.push({ number: `20${i}`, type: 'SINGLE', floor: 1, capacity: 1, status: 'AVAILABLE', pricePerNight: 8000 });
      rooms.push({ number: `30${i}`, type: 'DOUBLE', floor: 2, capacity: 2, status: 'AVAILABLE', pricePerNight: 5000 });
    }
    await prisma.room.createMany({ data: rooms });

    // 7. Patients
    console.log('Creating 100 patients...');
    const patients = [];
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    for (let i = 1; i <= 100; i++) {
      const dateOfBirth = new Date(Date.now() - Math.floor(Math.random() * 80 + 5) * 31556952000);
      patients.push({
        patientNumber: generatePatientNumber(i),
        firstName: randomElement(firstNames),
        lastName: randomElement(lastNames),
        dateOfBirth,
        gender: Math.random() > 0.5 ? 'MALE' : 'FEMALE',
        email: Math.random() > 0.5 ? `patient${i}@example.com` : null,
        phone: generatePhoneNumber(),
        address: `Cité ${Math.floor(Math.random() * 500)} Logements`,
        city: randomElement(cities),
        bloodGroup: randomElement(bloodGroups),
        allergies: Math.random() > 0.8 ? 'Pénicilline' : null,
        insuranceId: Math.random() > 0.3 ? randomElement(createdInsurances).id : null,
      });
    }
    
    await prisma.patient.createMany({ data: patients });
    const createdPatients = await prisma.patient.findMany();

    // 8. Appointments & Consultations
    console.log('Creating appointments and consultations...');
    for (let i = 0; i < 30; i++) {
      const isPast = i < 15;
      const date = new Date();
      if (isPast) {
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      } else {
        date.setDate(date.getDate() + Math.floor(Math.random() * 14) + 1);
      }
      date.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0);
      
      const doc = randomElement(createdDoctors);
      const pat = randomElement(createdPatients);
      
      const appointment = await prisma.appointment.create({
        data: {
          patientId: pat.id,
          doctorId: doc.id,
          date,
          status: isPast ? 'COMPLETED' : 'SCHEDULED',
          type: 'CONSULTATION',
          reason: 'Consultation de routine'
        }
      });

      if (isPast) {
        const diag = ['Hypertension', 'Diabète', 'Infection urinaire', 'Grippe', 'Angine', 'Dermatite', 'Migraine'];
        const consultation = await prisma.consultation.create({
          data: {
            appointmentId: appointment.id,
            doctorId: doc.id,
            patientId: pat.id,
            symptoms: 'Fièvre et maux de tête',
            diagnosis: randomElement(diag),
            notes: 'Patient doit se reposer',
            systolic: 120 + Math.floor(Math.random() * 30),
            diastolic: 70 + Math.floor(Math.random() * 20),
            temperature: 37 + Math.random() * 2,
            weight: 60 + Math.random() * 40,
          }
        });

        // Prescription
        if (Math.random() > 0.3) {
          const meds = ['Paracétamol 1g', 'Amoxicilline 500mg', 'Oméprazole 20mg', 'Metformine 850mg', 'Ibuprofène 400mg'];
          const presc = await prisma.prescription.create({
            data: {
              consultationId: consultation.id,
              doctorId: doc.id,
              patientId: pat.id,
              notes: 'A prendre après les repas'
            }
          });
          
          await prisma.prescriptionItem.create({
            data: {
              prescriptionId: presc.id,
              medicationName: randomElement(meds),
              dosage: '1 comprimé',
              frequency: '3 fois par jour',
              duration: '5 jours',
              instructions: 'Ne pas dépasser la dose prescrite'
            }
          });
        }
      }
    }

    // 9. Medications & Inventory
    console.log('Creating medications and inventory...');
    const medications = ['Paracétamol', 'Amoxicilline', 'Oméprazole', 'Ibuprofène', 'Vitamine C'];
    for (const m of medications) {
      await prisma.medication.create({
        data: {
          name: m,
          genericName: m,
          form: 'COMPRIME',
          dosage: '500mg',
          manufacturer: 'SAIDAL',
          price: 250,
          requiresPrescription: Math.random() > 0.5,
          stock: 100,
          minStock: 20
        }
      });
    }

    for (let i = 1; i <= 5; i++) {
      await prisma.inventoryItem.create({
        data: {
          name: `Seringue ${i}ml`,
          category: 'MEDICAL_SUPPLY',
          quantity: 500,
          unit: 'pcs',
          minQuantity: 100,
          unitPrice: 15,
          supplier: 'Medical Equip DZ'
        }
      });
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
