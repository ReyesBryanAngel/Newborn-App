import * as yup from 'yup';
import { useFormik } from 'formik';

export const specimenDataFetcher = (res) => {
  const resData = res?.data?.samples;

  return {
    samples: {
      type_of_sample: resData?.type_of_sample ?? "",
      baby_last_name: resData?.baby_last_name ?? "",
      baby_first_name: resData?.baby_first_name ?? "",
      mothers_first_name: resData?.mothers_first_name ?? "",
      for_multiple_births: resData?.for_multiple_births ?? "",
      place_of_birth: resData?.place_of_birth ?? "",
      date_and_time_of_birth: resData?.date_and_time_of_birth ?? "",
      date_and_time_of_collection: resData?.date_and_time_of_collection ?? "",
      babys_weight_in_grams: resData?.babys_weight_in_grams ?? "",
      age_of_gestation_in_weeks: resData?.age_of_gestation_in_weeks ?? "",
      sex: resData?.sex ?? "",
      specimens: resData?.specimens ?? "",
      specimen_status: resData?.specimen_status ?? "",
      place_of_collection: resData?.place_of_collection ?? "",
      attending_practitioner: resData?.attending_practitioner ?? "",
      practitioners_day_contact_number: resData?.practitioners_day_contact_number ?? "",
      practitioners_mobile_number: resData?.practitioners_mobile_number ?? "",
      practitioner_profession: resData?.practitioner_profession ?? "",
      practitioner_profession_other: resData?.practitioner_profession_other ?? "",
      baby_status: resData?.baby_status ?? "",
      baby_status_cont: resData?.baby_status_cont ?? "",
      name_of_parent: resData?.name_of_parent ?? "",
      number_and_street: resData?.number_and_street ?? "",
      barangay_or_city: resData?.barangay_or_city ?? "",
      province: resData?.province ?? "",
      zip_code: resData?.zip_code ?? "",
      contact_number_of_parent: resData?.contact_number_of_parent ?? "",
      additional_contact_number: resData?.additional_contact_number ?? ""
    }
  }
}

export const UserFormik = (specimenData, dispatch, navigate, createSpecimen) => {
    const initialValues = {
      type_of_sample: specimenData.type_of_sample,
      baby_last_name: specimenData.baby_last_name,
      baby_first_name: specimenData.baby_first_name,
      mothers_first_name: specimenData.mothers_first_name,
      for_multiple_births: specimenData.for_multiple_births,
      place_of_birth: specimenData.place_of_birth,
      date_and_time_of_birth: specimenData.date_and_time_of_birth,
      date_and_time_of_collection: specimenData.date_and_time_of_collection,
      babys_weight_in_grams: specimenData.babys_weight_in_grams,
      age_of_gestation_in_weeks: specimenData.age_of_gestation_in_weeks,
      sex: specimenData.sex,
      specimens: specimenData.specimens,
      specimen_status: specimenData.specimen_status,
      place_of_collection: specimenData.place_of_collection,
      attending_practitioner: specimenData.attending_practitioner,
      practitioners_day_contact_number: specimenData.practitioners_day_contact_number,
      practitioners_mobile_number: specimenData.practitioners_mobile_number,
      practitioner_profession: specimenData.practitioner_profession,
      practitioner_profession_other: specimenData.practitioner_profession_other,
      baby_status: specimenData.baby_status,
      baby_status_cont: specimenData.baby_status_cont,
      name_of_parent: specimenData.name_of_parent,
      number_and_street: specimenData.number_and_street,
      barangay_or_city: specimenData.barangay_or_city,
      province: specimenData.province,
      zip_code: specimenData.zip_code,
      contact_number_of_parent: specimenData.contact_number_of_parent,
      additional_contact_number: specimenData.additional_contact_number
    }

    const validationSchema = yup.object({
        type_of_sample: yup.string().required('Type of Sample is required'),
        baby_last_name: yup.string().required('Babys Last Name is required'),
        baby_first_name: yup.string(),
        mothers_first_name: yup.string().required('Mothers First Name is required'),
        for_multiple_births: yup.string().required('For Multiple Births is required'),
        date_and_time_of_birth: yup.string().required('Date of Birth is required'),
        place_of_birth: yup.string().required('Place of Birth is required'),
        date_and_time_of_collection: yup.string().required('Date and Time of Collection is required'),
        babys_weight_in_grams: yup.number().required("Baby's Weight in Grams is required"),
        age_of_gestation_in_weeks: yup.number().required('Age of Gestation (in Weeks) is required'),
        sex: yup.string().required('Sex is required'),
        specimens: yup.string().required('Specimen is required'),
        place_of_collection: yup.string().required('Hospital/Place of Collection is required'),
        attending_practitioner: yup.string().required('Attending Practitioner is required'),
        practitioner_profession: yup.string().required('Practitioner is required'),
        practitioner_profession_other: yup
        .string()
        .when("practitioner_profession", {
          is: "other",
          then: () => yup.string().required("Other practitioner is required")
        }),
        practitioners_day_contact_number: yup.string().required('Practitioners Day Contact Number is required'),
        practitioners_mobile_number: yup.string().required('Practitioners Mobile Number is required'),
        baby_status: yup.string().required('Baby Status is required'),
        baby_status_cont: yup
        .string()
        .when("baby_status", {
          is: (value) => [
            'Date of Blood Transfusion', 
            'Combination of above, please state', 
            'Other Relevant Clinical Information'].includes(value),
          then: () => yup.string().required("Baby Status (Cont) is required")
        }),
        name_of_parent: yup.string().required('Name of Parent/Guardian is required'),
        number_and_street: yup.string().required('Number and Street is required'),
        barangay_or_city: yup.string().required('Barangay/City is required'),
        province: yup.string().required('Province is required'),
        zip_code: yup.string().required('Zip Code is required'),
        contact_number_of_parent: yup.string().required('Contact Number of Parent/Guardian is required'),
        additional_contact_number: yup.string().required('Additional Contact Number of Parent/Guardian is required'),
    })

    const formik = useFormik ({
        initialValues,
        validationSchema,
        validateOnBlur: true,
        enableReinitialize: false,
        onSubmit: (values) => {
            if (createSpecimen) {
                dispatch({ type: 'UPDATE', payload: values });
                setFieldValue("specimen_status", "Pending");
                navigate("/add-specimen/specimen-review");
            }
          },
    });

    const {
        values,
        touched,
        errors,
        setValues,
        setStatus,
        handleBlur,
        setFieldValue,
        setFieldTouched,
        setTouched,
        validateForm,
        handleChange,
        handleSubmit
    } = formik;

    return {
        values,
        touched,
        errors,
        setValues,
        setStatus,
        handleBlur,
        setFieldValue,
        setFieldTouched,
        setTouched,
        validateForm,
        handleChange,
        handleSubmit
    }
}