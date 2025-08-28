## Performance Profiling Task

1. **Initial Profiling with React Dev Tools Profiler**
   - Use the React Dev Tools Profiler to measure the performance of your application (e.g., sorting a column, searching a country, selecting another year, adding/removing columns).
   - Record interactions and analyze the results.
   - Put a brief description of the app performance, including screenshots from the Profiler, in the app's `README.md` file.
   - **Parameters to Check:**
     - **Commit Duration:** Time taken for React to render the committed updates.
     - **Render Duration:** Time taken for individual components to render.
     - **Interactions:** User interactions that triggered the renders.
     - **Flame Graph:** Visual representation of component render times.
     - **Ranked Chart:** Sorted list of components by render duration.

2. **Update the App with React.memo and useMemo**
   - Optimize your application by using `React.memo` and `useMemo` to prevent unnecessary re-renders and memoize values.
   - Perform the same profiling again using the React Dev Tools Profiler.
   - Update the `README.md` file with the updated results and screenshots from the Profiler.
   - **Parameters to Check:**
     - **Commit Duration:** Compare the time taken for React to render the committed updates before and after optimization.
     - **Render Duration:** Compare the time taken for individual components to render before and after optimization.
     - **Interactions:** Analyze if the number of interactions triggering renders has decreased.
     - **Flame Graph:** Compare the visual representation of component render times before and after optimization.
     - **Ranked Chart:** Compare the sorted list of components by render duration before and after optimization.
