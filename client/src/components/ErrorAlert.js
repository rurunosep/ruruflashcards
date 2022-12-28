export default function ErrorAlert({ errorMessage, setErrorMessage }) {
	if (!errorMessage) return null

	return (
		<div className='padding-small' style={{ width: '100%' }}>
			<input
				className='alert-state'
				id='alert-1'
				type='checkbox'
				onChange={(e) => {
					if (e.target.checked) {
						setErrorMessage(null)
					}
				}}
			/>
			<div className='alert alert-danger dismissible margin-none'>
				{errorMessage}
				<label className='btn-close' htmlFor='alert-1'>
					X
				</label>
			</div>
		</div>
	)
}
