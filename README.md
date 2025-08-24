# React Forms 
# In this branch need to create app 

1. **Portals**. Use React Portals to display forms in modals:

   - Main page should have buttons to open 2 different modals
   - **Shared modal component** that renders different content:
     - Form created using uncontrolled components approach
     - Similar form created using React Hook Form
   - Modals should be properly accessible (focus management, ESC key to close, click outside to close)

2. **State Management**. Use Redux or Zustand to store the data provided by both approaches on the Main route. You can use tiles to display data taken from each form.

3. **Forms**
   Both forms will collect the same data:

   - name (validate for first uppercased letter)
   - age (should be number, no negative values)
   - email (validate for email)
   - 2 passwords (should match, display the password strength: 1 number, 1 uppercased letter, 1 lowercased letter, 1 special character)
   - gender (you can use radio buttons or select control)
   - accept Terms and Conditions agreement (T&C, can be a checkbox)
   - input control to upload picture (validate size and extension, allow png jpeg, save in redux store as base64)
   - autocomplete control to select country (all countries should be stored in the Redux store)
     Form should contain labels, which should be connected with inputs (look at **htmlFor**)

4. **Validation**
   Implement validation according to the input descriptions in p. 3. Use **Yup** or **Zod** (but pick just one) as the validation schema. Show error messages consistently — either above or below each field, and stick with that placement throughout the form.

   - For the **React Hook Form** approach, the submit button should be **disabled** while there are validation errors (live validation).
   - The **uncontrolled form** should validate inputs only **on submit**, and does **not need to disable** the submit button.

   Avoid layout shifts when showing error messages to ensure a smooth user experience.

5. **After submitting the form**
   On successful form submission close the modal and display the newly entered data on the main page. Make an indication for a newly entered data on the main route (e.g. show border in a different color for a few seconds, or a different background color)

6. **Testing Requirements / Unit Testing**

   - **Form Components Testing**: Test both uncontrolled and React Hook Form implementations

     - Test form rendering with all required fields
     - Test field validation (name, age, email, passwords, etc.)
     - Test password strength calculation
     - Test form submission with valid/invalid data
     - Test error message display and clearing

   - **Modal Components Testing**:

     - Test modal opening/closing functionality
     - Test accessibility features (focus management, ESC key)
     - Test click outside to close behavior
     - Test portal rendering

   - **Redux Store Testing**:

     - Test actions and action creators
     - Test reducers with different action types
     - Test selectors
     - Test store state updates after form submissions

   - **Utility Functions Testing**:
     - Test password strength validation
     - Test image to base64 conversion
     - Test form validation helpers
     - Test country autocomplete filtering
