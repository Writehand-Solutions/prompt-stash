---
id: 8c7a5d9e-c8f8-4b1d-9d2c-a5d9e9b8f8b1
locked: false
title: Python Code Generation for Data Science Problem
description: This prompt generates a Python code solution for a given data science problem by leveraging code snippets from multiple domain experts.
input_variables:
  - name: question
    description: The data science problem to be solved
    type: string
    required: true
    variable_validation: ^.+$
  - name: generated_code_1
    description: The code snippet provided by the Python developer
    type: string
    required: true
    variable_validation: ^.+$
  - name: generated_code_2
    description: The code snippet provided by the data analyst
    type: string
    required: true
    variable_validation: ^.+$
  - name: generated_code_3
    description: The code snippet provided by the numerical analysis developer
    type: string
    required: true
    variable_validation: ^.+$
  - name: generated_code_4
    description: The code snippet provided by the statistics modeller
    type: string
    required: true
    variable_validation: ^.+$
tags:
  - Python
  - Data Science
  - Code Generation
  - Visualization
examples:
  - input:
      question: Predict the sales for the next quarter based on historical data.
      generated_code_1: |-
        import pandas as pd

        df = pd.read_csv('sales_data.csv')
        df['Date'] = pd.to_datetime(df['Date'])
        df.set_index('Date', inplace=True)

        df_resampled = df.resample('Q').sum()

        from statsmodels.tsa.arima.model import ARIMA

        model = ARIMA(df_resampled, order=(1,1,1))
        model_fit = model.fit()

        forecast = model_fit.forecast(steps=1)
        print(f'Forecasted sales for the next quarter: {forecast[0]}')
      generated_code_2: |-
        import numpy as np

        sales_data = np.loadtxt('sales_data.csv', delimiter=',')

        X = sales_data[:, :-1]
        y = sales_data[:, -1]

        from sklearn.linear_model import LinearRegression

        model = LinearRegression()
        model.fit(X, y)

        next_quarter_features = np.array([[2.5, 1000, 0.1]])
        predicted_sales = model.predict(next_quarter_features)
        print(f'Predicted sales for the next quarter: {predicted_sales[0]}')
      generated_code_3: |-
        import scipy.optimize as opt

        def objective(x, a, b, c):
         return a * x + b * x**2 + c

        def model_func(x, a, b, c):
         return a * x + b * x**2 + c

        xdata = np.array([1, 2, 3, 4, 5])
        ydata = np.array([100, 200, 250, 300, 350])

        params, _ = opt.curve_fit(model_func, xdata, ydata)

        next_quarter = 6
        predicted_sales = objective(next_quarter, *params)
        print(f'Predicted sales for the next quarter: {predicted_sales}')
      generated_code_4: |-
        from statsmodels.tsa.holtwinters import ExponentialSmoothing

        model = ExponentialSmoothing(df, trend='add', seasonal='add', seasonal_periods=4)
        model_fit = model.fit()

        forecast = model_fit.forecast(1)
        print(f'Forecasted sales for the next quarter: {forecast[0]}')
    output: |-
      import pandas as pd
      import numpy as np
      import matplotlib.pyplot as plt
      import seaborn as sns
      from statsmodels.tsa.arima.model import ARIMA
      from sklearn.linear_model import LinearRegression
      import scipy.optimize as opt
      from statsmodels.tsa.holtwinters import ExponentialSmoothing

      # Load and preprocess data
      df = pd.read_csv('sales_data.csv')
      df['Date'] = pd.to_datetime(df['Date'])
      df.set_index('Date', inplace=True)

      # Resample data to quarterly frequency
      df_resampled = df.resample('Q').sum()

      # ARIMA model
      arima_model = ARIMA(df_resampled, order=(1,1,1))
      arima_model_fit = arima_model.fit()
      arima_forecast = arima_model_fit.forecast(steps=1)

      # Linear Regression model
      X = df_resampled.index.to_numpy().reshape(-1, 1)
      y = df_resampled['Sales'].to_numpy()
      linear_model = LinearRegression()
      linear_model.fit(X, y)
      next_quarter_features = np.array([[df_resampled.index[-1] + pd.offsets.QuarterEnd()]])
      linear_forecast = linear_model.predict(next_quarter_features)

      # Curve fitting model
      def objective(x, a, b, c):
       return a * x + b * x**2 + c

      def model_func(x, a, b, c):
       return a * x + b * x**2 + c

      xdata = np.arange(len(df_resampled))
      ydata = df_resampled['Sales'].to_numpy()
      params, _ = opt.curve_fit(model_func, xdata, ydata)
      next_quarter = len(df_resampled)
      curve_forecast = objective(next_quarter, *params)

      # Exponential Smoothing model
      exp_model = ExponentialSmoothing(df_resampled, trend='add', seasonal='add', seasonal_periods=4)
      exp_model_fit = exp_model.fit()
      exp_forecast = exp_model_fit.forecast(1)

      # Visualization
      plt.figure(figsize=(12, 6))
      plt.plot(df_resampled.index, df_resampled['Sales'], label='Actual Sales')
      plt.plot(arima_forecast.index, arima_forecast, label='ARIMA Forecast')
      plt.plot(linear_forecast.index, linear_forecast, label='Linear Regression Forecast')
      plt.plot(exp_forecast.index, exp_forecast, label='Exponential Smoothing Forecast')
      plt.plot(df_resampled.index[-1] + pd.offsets.QuarterEnd(), curve_forecast, 'ro', label='Curve Fitting Forecast')
      plt.xlabel('Date')
      plt.ylabel('Sales')
      plt.title('Sales Forecast for the Next Quarter')
      plt.legend()
      plt.show()

      print(f'ARIMA Forecast: {arima_forecast[0]}')
      print(f'Linear Regression Forecast: {linear_forecast[0]}')
      print(f'Exponential Smoothing Forecast: {exp_forecast[0]}')
      print(f'Curve Fitting Forecast: {curve_forecast}')
created_at: '2024-03-04T19:42:00Z'
updated_at: '2024-03-04T20:15:00Z'
bookmarked: false
---

You are experienced Data Scientist. You end goal is to provide a python code that can solve the question {question}.

Create visualization with matplot and seaborn to share insights with the enduser.

You have been given code from multiple people to solve the questions.

1. Python developer has sent to you the final code as per his understanding of the problem {generated_code_1}.

2. Data analyst has sent to you the final code as per his understanding of the problem {generated_code_2}.

3. Numerical analysis developer has sent to you the final code as per his understanding of the problem {generated_code_3}.

4. Statistics modeller has sent to you the final code {generated_code_4}.

Do Not Generate columns on your own.

