import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import MainButton from "./components/button/MainButton";
import CustomSelect from "./components/customSelect/CustomSelect";
import Message from "./components/message/Message";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchOptions } from "./store/slices/optionsSlice";
import { 
  selectOption, 
  clearMessages, 
  setMessages, 
  startSubmitting, 
  finishSubmitting 
} from "./store/slices/selectSlice";
import { submitSelectedOption } from "./store/slices/apiSlice";
import "./app.css";


const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const { 
    items: options, 
    isLoading, 
    error: optionsError,
    warningMessage
  } = useAppSelector((state) => state.options);
  
  const { 
    selectedValue, 
    isSubmitting, 
    messages 
  } = useAppSelector((state) => state.select);
  
  const { 
    lastResponse, 
    error: apiError 
  } = useAppSelector((state) => state.api);


  useEffect(() => {
    dispatch(fetchOptions());
  }, [dispatch]);


  useEffect(() => {
    if (lastResponse && lastResponse.message) {
      dispatch(setMessages([lastResponse.message]));
    }
  }, [lastResponse, dispatch]);


  useEffect(() => {
    if (apiError) {
      dispatch(setMessages([`Ошибка соединения с сервером: ${apiError}`]));
    }
  }, [apiError, dispatch]);


  const handleSelectChange = (value: string) => {
    dispatch(selectOption(value));
    dispatch(clearMessages());
  };

  // Обработчик отправки
  const handleSubmit = async () => {
    if (!selectedValue) {
      dispatch(setMessages(['Пожалуйста, выберите опцию']));
      return;
    }

    dispatch(startSubmitting());
    dispatch(clearMessages());
    
    try {
      await dispatch(submitSelectedOption(selectedValue)).unwrap();
    } catch (error) {
      console.error("Ошибка отправки:", error);
    } finally {
      dispatch(finishSubmitting());
    }
  };

  return (
    <div className="app">
      <div className="select-component">
        <div className="select-component-controls">
          <CustomSelect
            options={options}
            placeholder="Выберите число"
            onChange={handleSelectChange}
            isLoading={isLoading}
            error={optionsError}
          />
          <MainButton
            text="Отправить"
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedValue || isLoading}
            className=""
          />
        </div>
        <div className="select-component-messages">
          {(messages.length > 0 || warningMessage)  &&(
            <Message messages={[ 
              ...messages, 
              ...(warningMessage ? [warningMessage]: [])
            ]} />
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;