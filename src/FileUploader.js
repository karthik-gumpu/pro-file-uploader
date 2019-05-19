import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as R from 'ramda';

class FileUploader extends React.PureComponent {
	componentDidMount() {
		if (this.props.withDrag) {
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
		if (this.props.wichClick) {
			this.inputRef.click();
		}
	}

	getFileData = (file) => ({
		name: file.name,
        ext: R.last(file.name.split('.')),
        size: file.size,
		content: file,
	});

	isValidFiles = (files) => {
		const { accept } = this.props;
		if (!accept || !accept.length) {
			return true;
		}
		for (let i = 0; i < files.length; i++) {
			let foundValidFile = false;
			const fileType = R.last(`${files[i].name}`.split('.'));
			for (let j = 0; j < accept.length; j++) {
				if (R.toLower(fileType) === R.toLower(accept[j])) {
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
        if(this.props.multiple) {
            this.props.onChange(allFiles);
        } else  {
            this.props.onChange(allFiles[0]);
        }
	}

    onChange = (e) => {
		this.processFiles(e.target.files);
		this.inputRef.value = '';
    }

	render() {
		const { accept } = this.props;
		return (
			<React.Fragment>
				{
					React.cloneElement(this.props.children, { onClick: this.onClick })
				}
				<input
					ref={(inputRef) => { this.inputRef = inputRef; }}
                    type="file"
                    multiple={this.props.multiple}
					accept={accept ? `${accept.join(',')}` : null}
					onChange={this.onChange}
					style={{ display: 'none' }}
				/>
			</React.Fragment>
		);
	}
}

FileUploader.defaultProps = {
	withDrag: true,
    wichClick: true,
    onError: () => null,
};

FileUploader.propTypes = {
	withDrag: PropTypes.bool,
	wichClick: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	onError: PropTypes.func,
	accept: PropTypes.any,
    browseType: PropTypes.any,
    multiple: PropTypes.bool,
};

export default FileUploader;