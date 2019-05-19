import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import R from 'ramda';

class FileUploader extends React.PureComponent {
	componentDidMount() {
		if (this.props.withDragAndDrop) {
			const dropzone = ReactDOM.findDOMNode(this);
			if (dropzone) {
				dropzone.addEventListener('dragenter', (e) => {
					e.stopPropagation();
					e.preventDefault();
					e.dataTransfer.dropEffect = 'copy';
					dropzone.style.border = '2px dashed gray';
				});
				dropzone.addEventListener('dragleave', (e) => {
					e.stopPropagation();
					e.preventDefault();
					e.dataTransfer.dropEffect = 'copy';
					dropzone.style.border = '0px dashed gray';
				});
				dropzone.addEventListener('dragover', (e) => {
					e.stopPropagation();
					e.preventDefault();
					e.dataTransfer.dropEffect = 'copy';
					dropzone.style.border = '2px dashed gray';
				});
				dropzone.addEventListener('drop', (e) => {
					e.preventDefault();
					e.stopPropagation();
					dropzone.style.border = '0px dashed gray';
					this.processFiles(e.dataTransfer.files);
				});
			}
		}
	}

	onClick = () => {
		if (this.props.clickToUpload) {
			this.inputRef.click();
		}
	}

	onChange = (e) => {
		this.processFiles(e.target.files);
		this.inputRef.value = '';
	}

	getFileData = (file) => ({
		name: file.name.split('.'),
		ext: R.last(file.name.split('.')),
		content: file,
	});

	isValidFiles = (files) => {
		const { allowedFileTypes } = this.props;
		if (!allowedFileTypes || !allowedFileTypes.length) {
			return true;
		}
		for (let i = 0; i < files.length; i++) {
			let foundValidFile = false;
			const fileType = R.last(`${files[i].name}`.split('.'));
			for (let j = 0; j < allowedFileTypes.length; j++) {
				if (R.toLower(`.${fileType}`) === R.toLower(allowedFileTypes[j])) {
					foundValidFile = true;
					break;
				}
			}
			if (!foundValidFile) {
				return false;
			}
		}
		return true;
	}

	processFiles = (files) => {
		if (!this.isValidFiles(files)) {
            this.props.onError("Invalid files");
			return;
        }
        const allFiles = [];
		for (let i = 0; i < files.length; i++) {
            allFiles.push(this.getFileData(files[i]))
		}
        this.props.onChange(allFiles);
	}

	render() {
		const { allowedFileTypes } = this.props;
		return (
			<React.Fragment>
				{
					React.cloneElement(this.props.children, { onClick: this.onClick })
				}
				<input
					ref={(inputRef) => { this.inputRef = inputRef; }}
					type="file"
					accept={allowedFileTypes ? `${allowedFileTypes.join(',')}` : null}
					onChange={this.onChange}
					style={{ display: 'none' }}
				/>
			</React.Fragment>
		);
	}
}

FileUploader.defaultProps = {
	withDragAndDrop: true,
    clickToUpload: true,
};

FileUploader.propTypes = {
	withDragAndDrop: PropTypes.bool,
	clickToUpload: PropTypes.bool,
	onChange: PropTypes.func,
	onError: PropTypes.func,
	allowedFileTypes: PropTypes.any,
    browseType: PropTypes.any,
};

export default FileUploader;